import { messagesModel } from '../models/chats.model.js'
import BasicManager from './basic.manager.js'

class MessagesManager extends BasicManager{

    constructor(){
        super(messagesModel)
    }
    
}

const messagesManager = new MessagesManager()

export default messagesManager