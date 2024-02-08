import { usersModel } from '../models/users.model.js'
import BasicManager from './basic.manager.js'

class UsersManager extends BasicManager{

    constructor(){
        super(usersModel, 'cart._id')
    }
    
    async findByEmail(email){
        const response = await usersModel.findOne({ email })
        if (!response) {
            return console.log('User not found')
        } else {
            return response
        }
    }

    async findGithub(email){
        const response = await usersModel.findOne({ email })
        if (!response) {
            return console.log('User not found')
        } else {
            return response
        }
    }

}

const usersManager = new UsersManager()

export default usersManager