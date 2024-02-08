import cartsManager from '../dao/managers/carts.manager.js'
import productsManager from '../dao/managers/products.manager.js'
import usersManager from '../dao/managers/users.manager.js'
import { 
    findAll,
    findById,
    deleteOne,
    updateOne
} from '../features/services/users.service.js'
import { transporter } from '../utils/nodemailer.js'
import { hashData } from '../utils/utils.js'
import { docFilter, upload } from '../middlewares/multer.middleware.js'

const docsPath = path.join(process.cwd(), 'images', 'documents')
const reqDocs = [
    'identificacion.pdf',
    'comprobante.pdf',
    'eecc.pdf'
]
const filesInDocs = fs.readdirSync(docsPath)

export const findUsers = async (req, res) => {
    const users = await findAll()
    const carts = await cartsManager.findCarts()
    let productsArray = []
    carts.map(products => {
        let cart = { _id: products._id, products: [] }
        products.productsInCart.map(product => cart.products.push({ title: product.product.title, price: product.product.price }))
        productsArray.push(cart)
    })
    const products = await productsManager.findAll()
    res.render('users', { users, carts, products, productsArray })
}

export const findUserById = async (req, res) => {
    const { _id: id } = req.params
    try {
        const user = await findById(id)
        if (!user) {
            res.status(400).json( {message: 'Could not find any user with the id sent' })
        } else {
            res.status(200).json({ message: 'User found', user })
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const updateUser = async (req, res) => {
    const { _id: id } = req.params
    try {
        const response = await updateOne(id, req.body)
        if (response === -1) {
            res.status(400).json({ message: 'Could not find any user with the id sent' })
        } else {
            res.status(200).json({ message: 'User updated' })
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const deleteUser = async (req, res) => {
    const { _id: id } = req.params
    try {
        const response = await deleteOne(id, req.body)
        if (response === -1) {
            res.status(400).json({ message: 'Could not find any user with the id sent' })
        } else {
            res.status(200).json({ message: 'User deleted' })
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const requestPassword = async (req, res) => {
    try {
        function code(length) {
            let result = ''
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            const charactersLength = characters.length
            let counter = 0
            while (counter < length) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength))
              counter += 1
            }
            return result
        }
        const codeRequest = await code(6)
        const { ...resetPassRequest } = req.body
        const email = resetPassRequest
        const user = await usersManager.findByEmail(email.resetPassRequest)
        if (user) {
            user.token = codeRequest
            const tokenSaved = await user.save()
            const request = {
                from: 'quevedo.jpg@gmail.com',
                to: user.email,
                subject: 'new password request',
                text: `In order to reset your password you have to validate your mail by returning the following code into our website: ${codeRequest}`
            }
            await transporter.sendMail(request)
            res.render('reset')
        } else {
            res.status(400).json({ message: 'Could not find any user with the id sent' })
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { ...dataRequested } = req.body
        const usersInfo = dataRequested
        const userComp = await usersManager.findByEmail(usersInfo.email)
        if (userComp) {
            if (userComp.token == usersInfo.code) {
                userComp.password = await hashData(usersInfo.password)
                const newPassSaved = await userComp.save()
                res.render('login')
            }
        } else {
            res.status(400).json({ message: 'Could not find any user with the id sent' })
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const documentUpdate = async (req, res) => {
    const { _id: id } = req.params
    try {
        const user = await findById(id)
        if (!user) {
            res.status(400).json({ message: 'Could not find any user with the id sent' })
        } else {
            const filesFilter = filesInDocs.filter((filename) => {
                return filename.startsWith(_id + '-')
            })
            const existingDoc = reqDocs.every((doc) => {
                filesFilter.some((filename) => filename.includes(doc))
            })
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const documentPost = async (req, res) => {
    const { _id: id } = req.params
    if (!req.body.multer) {
        req.body.multer = {}
    }
    req.body.multer.userId = _id
    next()
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'productImage', maxCount: 1 },
        { name: 'documents' }
    ]),
    (req, res) => {
        const { _id: id } = req?.params
        const userId = req.body.multer?.userId
        res.send('documents uploaded')
    }
}