import productsManager from '../dao/managers/products.manager.js'
import { 
    findAll,
    findById,
    createOne,
    deleteOne,
    updateOne
} from '../features/services/carts.service.js'

export const findCarts = async (req, res) => {
    const carts = await findAll()
    if (!carts) {
        res.status(404).json({ message: 'Could not find any cart' })
    } else {
        let productsArray = []
        carts.map(products => {
            let cart = { _id: products._id, products: [] }
            products.productsInCart.map(product => cart.products.push({ title: product.product.title, price: product.product.price }))
            productsArray.push(cart)
        })
        const products = await productsManager.findAll()
        return res.render('carts', { carts, products, productsArray })
    }
}

export const findCartById = async (req, res) => {
    const { _id: id } = req.params
    const cart = await findById(id)
    if (!cart) {
        res.status(404).json({ message: 'Could not find any cart with the id sent' })
    } else {
        res.status(200).json({ message: 'Cart found', cart })
    }
}

export const createCart = async (req, res) => {
    try {
        const newCart = await createOne(req.body)
        res.status(200).json({ message: 'Cart created', cart: newCart })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const deleteCart = async (req, res) => {
    const { _id: id } = req.params
    try {
        const response = await deleteOne(id, req.body)
        if (response === -1) {
            res.status(400).json({ message: 'Could not find any cart with the id sent' })
        } else {
            res.status(200).json({ message: 'Cart deleted' })
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const updateCart = async (req, res) => {
    const cartCond = { _id: req.params.id }
    const prodCond = [{ _id: req.body.productsInCart }]
    const user = req.session.user
    try {
        if (user.email != prodCond.owner) {
            const response = await updateOne(cartCond, prodCond)
            if (!response) {
                res.status(400).json({ message: 'Could not find any cart with the id sent' })
            } else {
                res.status(200).json({ message: 'Cart updated' })
            }
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const purchaseCart = async (req, res) => {
    const user = await usersManager.findById(req.session.passport.user)
    console.log(user)
    //importar manager buscar user... 
    //verificar cart vacio... 
    //importar manager de products traer todos los products (mandar params)
    
    //crear funcion para verificar stock recibir como params los products (recorrer stock del cart contra db)...
    //pasar carro por params al pcalculator

    // const purchaseAmount = await ticketsManager.priceCalculator()
    // if (!code || !purchaser || !purchase_datetime || !cart ) {
    //     return res.status(400).json({ message: 'Some data is missing' });
    // }
    // try {
    //     if (user.usersCart.productsInCart.quantity < productsInCart.product.stock) {
    //         const newTicket = await ticketsManager.generateTicket({ ...obj, purchaser: user._id, cart: user.usersCart })
    //         const newStock = await ticketsManager.stockCalculator()
    //         res.status(200).json({ message: 'Ticket created', ticket: newTicket })
    //     } else {
    //         return res.status(400).json({ message: 'Sorry, there is not enough stock to procceed with your purchase, please try again with a smaller quantity'})
    //     }
    // } catch (error) {
    //     res.status(500).json({ message: error })
    // }
}