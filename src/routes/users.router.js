import { Router } from 'express'
import { 
    findUsers,
    findUserById,
    deleteUser,
    updateUser,
    requestPassword,
    resetPassword,
    documentPost
} from '../controllers/users.controller.js'

const router = Router()

router.get('/', findUsers)
router.get('/:_id', findUserById)
router.delete('/:_id', deleteUser)
router.put('/:_id', updateUser)
router.post('/request', requestPassword)
router.post('/reset', resetPassword)
router.post('/:_id/documents', documentPost)

export default router