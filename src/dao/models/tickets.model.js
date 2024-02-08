import { Schema, model, SchemaTypes } from 'mongoose'

const ticketsSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    purchase_datetime: {
        type: String,
        required: true
    },
    cart:{
        cart:{
        type: SchemaTypes.ObjectId,
        ref: 'Carts',
        },
        _id: false,
    }
})

export const ticketsModel = model('Tickets', ticketsSchema)