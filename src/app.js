import cookieParser from 'cookie-parser'
import compression from 'express-compression'
import express from 'express'
import handlebars from 'express-handlebars'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import session from 'express-session'
import swaggerUI from 'swagger-ui-express'
import { Server } from 'socket.io'

import cartsRouter from './routes/carts.router.js'
import messagesRouter from './routes/messages.router.js'
import productsRouter from './routes/products.router.js'
import sessionsRouter from './routes/sessions.router.js'
import usersRouter from './routes/users.router.js'
import viewsRouter from './routes/views.router.js'

import cartsManager from './dao/managers/carts.manager.js'
import chatsManager from './dao/managers/chats.manager.js'
import productsManager from './dao/managers/products.manager.js'
import usersManager from './dao/managers/users.manager.js'
import ticketsManager from './dao/managers/tickets.manager.js'

import { __dirname, hashData } from './utils/utils.js'
import { ErrorMessages } from './middlewares/errors/error.enum.js'
import { generateProduct } from './utils/faker.js'
import { logger } from './utils/winston.js'
import { swaggerSetup } from './utils/swaggerSpecs.js'
import CustomError from './middlewares/errors/custom.error.js'

import config from './config/dotenv.config.js'
import './config/db.config.js'
import './config/passport.config.js'

const app = express()
const MONGO_URI = config.mongo_uri
const KEY = config.secret_key
const PORT = config.port

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

app.use(session({
    secret: KEY,
    cookie: { maxAge: 60 * 60 * 1000 },
    store: new MongoStore({
        mongoUrl: MONGO_URI
    })
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api', viewsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/products', productsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/users', usersRouter)
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSetup))

app.use(compression())
app.get('/mockingproducts', (req, res) => {
    const mock = []
    for (let i = 0; i < 100; i++) {
        const product = generateProduct()
        mock.push(product)
    }
    res.send(mock)
})

app.get('/loggertest', (req, res) => {
    logger.fatal('Fatal')
    logger.error('Error')
    logger.warning('Warning')
    logger.info('Info')
    logger.http('HTTP')
    logger.debug('Debug')
    res.send('Testing Winston')
})

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

const httpServer = app.listen(PORT, () => {
    logger.info(`Listening to port ${ PORT } with Express`)
})

const socketServer = new Server(httpServer)

socketServer.on('connection', (socket) => {

    // CARTS
    
    socket.on('createCart', async() => {
        const creatingCart = await cartsManager.createOne()
        socket.emit('cartCreated', creatingCart)
    })

    socket.on('updateCart', async (updatingCartId, productsInAddP) => {
        const findUpdatingCart = await cartsManager.findById(updatingCartId._id)
        const productValidation = await productsManager.findById(productsInAddP.product._id)
        if (findUpdatingCart) {
            const { productsInCart } = findUpdatingCart
            const productIndex = findUpdatingCart.productsInCart.findIndex((p) => 
                p.product.equals(productsInAddP.product))
                if (productsInAddP.product.quantity > productValidation.stock) {
                    Swal.fire({
                        icon: 'error',
                        title: 'We ran out of stock, please try again later!',
                      })
                } else {
                    if (productIndex === -1) {
                        findUpdatingCart.productsInCart.push(productsInAddP)
                        findUpdatingCart.save()
                        productValidation.stock =-1
                        productValidation.save()
                    } else {
                        findUpdatingCart.productsInCart[productIndex].quantity++
                        findUpdatingCart.save()
                        productValidation.stock =-1
                        productValidation.save()
                    }
                }
            const newCartsArray = await cartsManager.findAll()
            socket.emit('cartUpdated', newCartsArray)
        } else {
            return CustomError.createError(ErrorMessages.CART_NOT_FOUND)
        }
    })

    socket.on('deletePFCart', async (deletePFCartId, deletingProductId) => {
        const findCart = await cartsManager.findById(deletePFCartId._id)
        if (findCart) {
            const productIndex = findCart.productsInCart.findIndex(obj => obj.product == deletingProductId.product)
            findCart.productsInCart.splice(productIndex, 1)
            const updateSaved = await findCart.save()
            const newPFCartsArray = await cartsManager.findAll()
            socket.emit('productFCDeleted', newPFCartsArray)
        } else {
            return CustomError.createError(ErrorMessages.CART_NOT_FOUND)
        }
    })
    
    socket.on('deleteCart', async(cartDelete) => {
        const cart = await cartsManager.findById(cartDelete._id)
        if (cart) {
            const deletingCart = await cartsManager.deleteOne(cartDelete._id)
            const newCartsArray = await cartsManager.findAll()
            socket.emit('cartDeleted', newCartsArray)
        } else {
            return CustomError.createError(ErrorMessages.CART_NOT_FOUND)
        }
    })

    socket.on('purchaseCart', async(purchase) => {
        const user = await usersManager.findByEmail(purchase.purchaser)
        const cart = await cartsManager.findById(purchase.cart)
        if (user && cart) {
            if (cart.productsInCart == '') {
                return console.log('Cart requested is empty, add some products')
            } else {
                const cartProducts = cart.productsInCart
                cartProducts.map(async (product) => {
                    const cartP = await productsManager.findById(product.product._id.toString())
                    console.log(cartP)
                    if(product.quantity <= cartP.stock) {
                        cartP.stock -= product.quantity
                        cartP.save()
                        const sum = ticketsManager.priceCalculator(cart)
                        const newTicket = { 
                            code: await hashData('1234'),
                            purchaser: user._id,
                            purchase_datetime: new Date(),
                            cart: cart,
                            total: sum
                        }
                        const creatingTicket = await ticketsManager.createOne(newTicket)
                        console.log('ticket', creatingTicket)
                    }
                })
                
            }
        } else {
            return CustomError.createError(ErrorMessages.CART_NOT_FOUND)
        }
    })

    // CHAT

    logger.info(`Client connected with id ${ socket.id }`)

    socket.on('disconnect', () => {
        logger.info(`Client disconnected with id ${ socket.id }`)
    })

    socket.on('newChatUser', (userEmail) => {
        socket.broadcast.emit('newChatUserBroadcast', userEmail)
    })

    socket.on('chatMessage', async(infoMessage) => {
        const newMessage = await chatsManager.createOne(infoMessage)
        socketServer.emit('chat', newMessage)
    })

    // PRODUCTS

    socket.on('createProduct', async(newProduct) => {
        const productOwner = await usersManager.findByEmail(newProduct.owner)
        if (!productOwner) {
            return CustomError.createError(ErrorMessages.PRODUCT_NOT_FOUND)
        } else {
            const creatingProduct = await productsManager.createOne({...newProduct, owner: productOwner})
            socket.emit('productCreated', creatingProduct)
        }
    })

    socket.on('updateProduct', async(newProductUpdate) => {
        const updatingProduct = await productsManager.findById(newProductUpdate._id)
        const productOwner = await usersManager.findByEmail(newProductUpdate.owner)
        if (updatingProduct || productOwner) {
            updatingProduct.title = newProductUpdate.title,
            updatingProduct.description = newProductUpdate.description,
            updatingProduct.code = newProductUpdate.code,
            updatingProduct.price = newProductUpdate.price,
            updatingProduct.status = newProductUpdate.status,
            updatingProduct.stock = newProductUpdate.stock,
            updatingProduct.category = newProductUpdate.category
            updatingProduct.owner.mail = newProductUpdate.owner
            const productUpdateSaved = await updatingProduct.save()
            const newProductUpdated = await productsManager.findAll()
            socket.emit('productUpdated', newProductUpdated)
        } else {
            return CustomError.createError(ErrorMessages.PRODUCT_NOT_FOUND)
        }
    })

    socket.on('deleteProduct', async(newProductDelete) => {
        const product = await productsManager.findById(newProductDelete._id)
        if (product) {
            const deletingProduct = await productsManager.deleteOne(newProductDelete._id)
            const newProductsArray = await productsManager.findAll()
            socket.emit('productDeleted', newProductsArray)
        } else {
            return CustomError.createError(ErrorMessages.PRODUCT_NOT_FOUND)
        }
    })

    // USERS

    socket.on('createUser', async(newUser) => {
        const creatingUser = await usersManager.createOne(newUser)
        socket.emit('userCreated', creatingUser)
    })

    socket.on('updateUser', async(newUserUpdate) => {
        const updatingUser = await usersManager.findById(newUserUpdate._id)
        const newUsersCart = await cartsManager.findCartById(newUserUpdate.cart)
        const hashedPassword = await hashData(newUserUpdate.password)
        if (updatingUser) {
            updatingUser.name = newUserUpdate.name,
            updatingUser.email = newUserUpdate.email,
            updatingUser.password = hashedPassword,
            updatingUser.role = newUserUpdate.role,
            updatingUser.usersCart.cart = newUsersCart
            const updateSaved = await updatingUser.save()
            const newUsersUpdated = await usersManager.findAll()
            socket.emit('userUpdated', newUsersUpdated)
        } else {
            return CustomError.createError(ErrorMessages.USER_NOT_FOUND)
        }
    })

    socket.on('deleteUser', async(newUserDelete) => {
        const deleteUser = await usersManager.findById(newUserDelete._id)
        if (deleteUser) {
            const deletingUser = await usersManager.deleteOne(newUserDelete._id)
            const newUsersArray = await usersManager.findAll()
            socket.emit('userDeleted', newUsersArray)
        } else {
            return CustomError.createError(ErrorMessages.USER_NOT_FOUND)
        }
    })

    socket.on('deleteInactiveUsers', async() => {
        const users = await usersManager.findAll()
        const inactiveUsers = users.filter(user => {
            return user && user.lastConnection && user.lastConnection.date && user.lastConnection.date.getTime() < Date.now() -  60 *  60 * 48 * 1000
        })
        inactiveUsers.forEach(user => {
            const request = {
                from: 'quevedo.jpg@gmail.com',
                to: user.email,
                subject: 'Removing inactive account',
                text: `We're sorry to inform you that your account is being removed from our server due to inactivity.`
            }
            transporter.sendMail(request)
            })
        await Promise.all(inactiveUsers.map(user => usersManager.deleteOne(user._id)))
        socket.emit('usersDeleted', inactiveUsers)
    })

    socket.on('requestNewPass', async(newCodeRequest) => {
        const user = await usersManager.findByEmail(newCodeRequest.email)
        if (user) {
            socket.emit('codeRequested')
        } else {
            return CustomError.createError(ErrorMessages.USER_NOT_FOUND)
        }
    })

    socket.on('resetOldPass', async(newPassValidation) => {
        const user = await usersManager.findByEmail(newPassValidation.email)
        if (user) {
            socket.emit('passResetOk')
        } else {
            return CustomError.createError(ErrorMessages.USER_NOT_FOUND)
        }
    })

})

// entrega 16 (test compra), solo falta generar ticket