import '../src/config/db.config.js'
import { CartsManager } from '../src/dao/managers/carts.manager.js'
import { ProductsManager } from '../src/dao/managers/products.manager.js'
import { expect } from 'chai'

describe('carts crud dao testing', () => {

    before(function(){
        this.cartsDao = new CartsManager()
    })

    it('should return the carts array', async function(){
        const result = await this.cartsDao.findAll()
        expect(result).to.be.an('array')
    })

    it('should return the first cart of the array', async function(){
        const carts = await this.cartsDao.findAll()
        const result = await this.cartsDao.findById(carts[0]._id)
        expect(result).to.have.property('_id')
    })

    it('should create a new cart', async function(){
        this.productsDao = new ProductsManager()
        const products = await this.productsDao.findAll()
        const productFound = await this.productsDao.findById(products[0]._id)
        const productId = productFound._id
        const cartMock = {
            productsInCart: [{
                product: productId,
                quantity: 1,
            }]
        }
        const createResult = await this.cartsDao.createOne(cartMock)
        expect(createResult).to.have.property('_id')
    })

    it('should update the cart just created', async function(){
        this.productsDao = new ProductsManager()
        const products = await this.productsDao.findAll()
        const productFound = await this.productsDao.findById(products[1]._id)
        const productId = productFound._id
        const cartMock = {
            productsInCart: [{
                product: productId,
                quantity: 1,
                _id: false
            }]
        }
        const carts = await this.cartsDao.findAll()
        const result = await this.cartsDao.updateOne({ _id: carts[carts.length-1]._id }, cartMock)
        expect(result).to.be.an('object')
    })

    after(async function(){
        const carts = await this.cartsDao.findAll()
        // this.cartsDao.deleteOne({ _id: carts[carts.length-1]._id })
    })

})