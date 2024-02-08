import cartsManager from '../dao/managers/carts.manager.js'
import productsManager from '../dao/managers/products.manager.js'
import usersManager from '../dao/managers/users.manager.js'
import UsersDTO from '../features/dto/users.dto.js'

export const homeRender = async (req, res) => {
    const carts = await cartsManager.findCarts()
    let productsArray = []
    carts.map(products => {
        let cart = { _id: products._id, products: [] }
        products.productsInCart.map(product => cart.products.push({ title: product.product.title, price: product.product.price }))
        productsArray.push(cart)
    })
    const products = await productsManager.findAll()
    const users = await usersManager.findAll()
    res.render('home', { carts, products, productsArray, users })
}

export const signupRender = async (req, res) => {
    res.render('signup')
}

export const loginRender = async (req, res) => {
    res.render('login')
}

export const signupSuccess = async (req, res) => {
    res.render('signupsuccess', { name: req.user.name })
}

export const currentSessionRender = async (req, res) => {
    const usersDTO = new UsersDTO({ name: req.user.name })
    res.render('currentsession', usersDTO)
}

export const requestRender = async (req, res) => {
    res.render('request')
}

export const resetRender = async (req, res) => {
    res.render('reset')
}

export const errorRender = async (req, res) => {
    res.render('error')
}