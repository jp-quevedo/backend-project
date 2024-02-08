import cartsManager from '../../dao/managers/carts.manager.js'

export const findAll = () => {
    const carts = cartsManager.findCarts()
    return carts
}

export const findById = (_id) => {
    const cart = cartsManager.findCartById(_id)
    return cart
}

export const createOne = (obj) => {
    const newCart = cartsManager.createOne(obj)
    return newCart
}

export const deleteOne = (_id) => {
    const deleteResponse = cartsManager.deleteOne(_id, req.body)
    return deleteResponse
}

export const updateOne = ({ _id }, obj) => {
    const cartCond = { _id: req.params.id }
    const prodCond = [{ _id: req.body.productsInCart }]
    const cartUpdate = cartsManager.updateOne(cartCond, prodCond)
    return cartUpdate
}