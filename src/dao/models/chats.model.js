import { Schema, model } from 'mongoose'

const messagesSchema = new Schema({
    userEmail:{
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true,
    }
})

export const messagesModel = model('chat', messagesSchema)