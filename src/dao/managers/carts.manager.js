import { cartsModel } from '../models/carts.model.js'
import BasicManager from './basic.manager.js'

export class CartsManager extends BasicManager {

    constructor(){
        super(cartsModel)
    }

    async findCarts() {
        const carts = await cartsModel
        .find()
        .populate('productsInCart.product', ['title', 'price'])
        return carts
    }
    
    async findCartById(id) {
        const cart = await cartsModel
            .findById({ _id: id })
            .populate('productsInCart.product', ['title', 'price'])
        return cart
    }

}

const cartsManager = new CartsManager()

export default cartsManager