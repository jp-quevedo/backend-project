import { Router } from 'express'
import { 
    findUsers,
    findUserById,
    deleteUser,
    updateUser,
    requestPassword,
    resetPassword,
    documentPost,
    allUsers,
    inactiveUser
} from '../controllers/users.controller.js'
import { adminMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', adminMiddleware, findUsers)
router.get('/all', allUsers)
router.get('/:_id', findUserById)
router.delete('/:_id', deleteUser)
router.delete('/inactive', inactiveUser)
router.put('/:_id', updateUser)
router.post('/request', requestPassword)
router.post('/reset', resetPassword)
router.post('/:_id/documents', documentPost)

export default router