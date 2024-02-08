import productsManager from '../../dao/managers/products.manager.js'

export const findAll = () => {
    const products = productsManager.findAll()
    return products
}

export const findById = (_id) => {
    const product = productsManager.findById(_id)
    return product
}

export const createOne = (obj) => {
    const newProduct = productsManager.createOne(obj)
    return newProduct
}

export const deleteOne = (_id) => {
    const deleteResponse = productsManager.deleteOne(_id, req.body)
    return deleteResponse
}

export const updateOne = ({ _id: id }, obj) => {
    const productUpdate = productsManager.updateOne({ _id: id }, obj)
    return productUpdate
}

export const productsFilter = (obj) => {
    const filter = productsManager.productsFilter(obj)
    return filter
}

export const aggregation = () => {
    const productAggregation = productsManager.aggregation()
    return productAggregation
}