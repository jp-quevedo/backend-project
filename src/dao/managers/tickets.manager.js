import BasicManager from './basic.manager.js'
import { ticketsModel } from '../models/tickets.model.js'
import { hashData } from '../../utils/utils.js'

class TicketsManager extends BasicManager {

    constructor() {
        super(ticketsModel, 'cart._id')
    }

    async generateTicket(obj) {
        try {
            const {
                code = await hashData(math.random()),
                purchaser = user._id,
                purchase_datetime = new Date(),
                cart = user.usersCart,
            } = obj
            return obj
        } catch (error) {
            return error
        }
    }

    async priceCalculator() {
        let total = 0
        productsInCart.forEach((product) => {
            total += product.quantity * product.product.price
        })
        return total
    }

    async stockCalculator() {
        const productStock = productsInCart.forEach((product) => { product.product.stock })
        const stockUpdate = productStock ? product.product.stock - productsInCart.quantity : product.product.stock
        return stockUpdate
    }

}

const ticketsManager = new TicketsManager()

export default ticketsManager