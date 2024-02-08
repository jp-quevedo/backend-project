import usersManager from '../../dao/managers/users.manager.js'

export const findAll = () => {
    const users = usersManager.findAll()
    return users
}

export const findById = (_id) => {
    const user = usersManager.findById(_id)
    return user
}

export const createOne = (obj) => {
    const newUser = usersManager.createOne(obj)
    return newUser
}

export const deleteOne = (_id) => {
    const deleteResponse = usersManager.deleteOne(_id, req.body)
    return deleteResponse
}

export const updateOne = ({ _id: id }, obj) => {
    const userUpdate = usersManager.updateOne({ _id: id }, obj)
    return userUpdate
}

export const emailFilter = (email) => {
    const emailResponse = usersManager.findByEmail(email, req.body)
    return emailResponse
}

export const githubFilter = (email) => {
    const githubResponse = usersManager.findGithub(email)
    return githubResponse
}