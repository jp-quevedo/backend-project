import { Router } from 'express'
import { premiumMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'
import {
    findProducts,
    findProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    filterProducts,
    aggregationProducts
} from '../controllers/products.controller.js'

const router = Router()

router.get('/', premiumMiddleware, findProducts)
router.get('/:_id', findProductById)
router.post('/', premiumMiddleware, upload.single('productimage.jpeg'), createProduct)
router.delete('/:_id', adminMiddleware, deleteProduct)
router.put('/:_id', adminMiddleware, updateProduct)
router.get('/filter', filterProducts)
router.get('/aggregation', aggregationProducts)

export default router