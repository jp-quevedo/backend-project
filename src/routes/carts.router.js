import { Router } from 'express'
import { userMiddleware } from '../middlewares/auth.middleware.js'
import {
    findCarts,
    findCartById,
    createCart,
    deleteCart,
    updateCart,
    purchaseCart
} from '../controllers/carts.controller.js'

const router = Router()

router.get('/', userMiddleware, findCarts)
router.get('/:_id', findCartById)
router.post('/', createCart)
router.delete('/:_id', deleteCart)
router.put('/:_id', updateCart)
router.post('/:_id/purchase', purchaseCart)

export default router