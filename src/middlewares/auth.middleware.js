import usersManager from '../dao/managers/users.manager.js'

export const adminMiddleware = async (req, res, next)=>{
    const userSession = await usersManager.findById(req.session.passport.user)
    if (userSession.role == 'admin') {
        next()
    } else {
        return res.send('Unauthorized')
    }
}

export const userMiddleware = async (req, res, next)=>{
    const userSession = await usersManager.findById(req.session.passport.user)
    if (userSession.role == 'user') {
        next()
    } else {
        return res.send('Unauthorized')
    }
}

export const premiumMiddleware = async (req, res, next)=>{
    const userSession = await usersManager.findById(req.session.passport.user)
    if (userSession.role == 'premium' || 'admin') {
        next()
    } else {
        return res.send('Unauthorized')
    }
}