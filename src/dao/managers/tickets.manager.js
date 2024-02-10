import BasicManager from './basic.manager.js'
import { ticketsModel } from '../models/tickets.model.js'
import { hashData } from '../../utils/utils.js'

class TicketsManager extends BasicManager {

    constructor() {
        super(ticketsModel, 'cart._id')
    }

    async createOne(obj) {
            const {
                code = await hashData(math.random()),
                purchaser = user._id,
                purchase_datetime = new Date(),
                cart = cart,
                total = sum
            } = obj
            return obj
    }

    async priceCalculator(cart) {
        let total = 0
        cart.productsInCart.forEach((product) => {
            total += product.quantity * product.product.price
        })
        return total
    }

}

const ticketsManager = new TicketsManager()

export default ticketsManager