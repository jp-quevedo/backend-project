import usersManager from '../dao/managers/users.manager.js'
import { 
    findAll,
    findById,
    createOne,
    deleteOne,
    updateOne,
    productsFilter,
    aggregation
} from '../features/services/products.service.js'
import { transporter } from '../utils/nodemailer.js'

export const findProducts = async (req, res) => {
    const products = await findAll()
    res.render('products', { products })
}

export const findProductById = async (req, res) => {
    const { _id: id } = req.params
    try {
        const product = await findById(id)
        if (!product) {
            res.status(400).json({ message: 'Could not find any product with the id sent' })
        } else {
            res.status(200).json({ message: 'Product found', product })
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const createProduct = async (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body
    if (!title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).json({ message: 'Some data is missing' });
    }
    try {
        const newProduct = await createOne(req.body)
        res.status(200).json({ message: 'Product created', product: newProduct })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const deleteProduct = async (req, res) => {
    const { _id: id } = req.params
    const user = await usersManager.findById(req.session.passport.user)
    try {
        const product = await findById(id)
        if (user.email == product.owner.email || user.role == 'admin') {
            const premiumUser = await usersManager.findByEmail(product.owner.email)
            const response = await deleteOne(id, req.body)
            if (response === -1) {
                res.status(400).json({ message: 'Could not find any product with the id sent' })
            } else {
                if (premiumUser.role == premium) {
                    const request = {
                        from: 'quevedo.jpg@gmail.com',
                        to: premiumUser.email,
                        subject: 'product removal',
                        text: `We're sorry to inform you that we are removing following product of our database ${product._id}`
                    }
                    await transporter.sendMail(request)
                }
                res.status(200).json({ message: 'Product deleted' })
            }
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const updateProduct = async (req, res) => {
    const { _id: id } = req.params
    try {
        const response = await updateOne(id, req.body)
        if (response === -1) {
            res.status(400).json({ message: 'Could not find any product with the id sent' })
        } else {
            res.status(200).json({ message: 'Product updated' })
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const filterProducts = async (req, res) => {
    const products = await productsFilter(req.query)
    res.json({ products })
}

export const aggregationProducts = async (req, res) => {
    const products = await aggregation()
    res.json({ products })
}