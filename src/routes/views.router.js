import { Router } from 'express'
import {
    homeRender,
    signupRender,
    loginRender,
    signupSuccess,
    currentSessionRender,
    requestRender,
    resetRender,
    errorRender
} from '../controllers/views.controller.js'

const router = Router()

router.get('/home', homeRender)
router.get('/users/request', requestRender)
router.get('/users/reset', resetRender)
router.get('/sessions/signup', signupRender)
router.get('/sessions/login', loginRender)
router.get('/messages/signupsuccess', signupSuccess)
router.get('/sessions/current', currentSessionRender)
router.get('/error', errorRender)

export default router