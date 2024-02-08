import '../src/config/db.config.js'
import { ProductsManager } from '../src/dao/managers/products.manager.js'
import { expect } from 'chai'

describe('products crud dao testing', () => {

    before(function(){
        this.productsDao = new ProductsManager()
    })

    it('should return the products array', async function(){
        const result = await this.productsDao.findAll()
        expect(result).to.be.an('array')
    })

    it('should return the first product of the array', async function(){
        const products = await this.productsDao.findAll()
        const result = await this.productsDao.findById(products[0]._id)
        expect(result).to.have.property('_id')
    })

    it('should throw an error if the title is missing', async function(){
        const productMock = {
            description: 'mock',
            code: 'mock',
            price: 1500,
            status: true,
            stock: 1500,
            category: 'mock'
        }
        try {
            await this.productsDao.save(productMock)
        } catch (error) {
            expect(error).to.be.an('error')
        }
    })

    it('should create a new product', async function(){
        const productMock = {
            title: 'mock',
            description: 'mock',
            code: 'mock',
            price: 1500,
            status: true,
            stock: 1500,
            category: 'mock'
        }
        const result = await this.productsDao.createOne(productMock)
        expect(result).to.have.property('_id')
    })

    it('should update the product just created', async function(){
        const productMock = {
            title: 'updated mock',
            description: 'updated mock',
            code: 'updated mock',
            price: 150,
            status: false,
            stock: 150,
            category: 'updated mock'
        }
        const products = await this.productsDao.findAll()
        const result = await this.productsDao.updateOne({ _id: products[products.length-1]._id }, productMock)
        expect(result).to.be.an('object')
    })

    after(async function(){
        const products = await this.productsDao.findAll()
        this.productsDao.deleteOne({ _id: products[products.length-1]._id })
    })

})