import { Schema, model, SchemaTypes } from 'mongoose'

const documentSchema = new Schema({
    name: { type: String },
    reference: { type: String }
})

const lastConSchema = new Schema({
    date: { type: Date, default: Date.now },
    action: { type: String, enum: ['login', 'logout'], required: true }
})

const usersSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['user', 'admin', 'premium'],
        default: 'user'
    },
    githubAuth:{
        type: Boolean,
        default: false
    },
    usersCart:{
        cart:{
        type: SchemaTypes.ObjectId,
        ref: 'Carts'
        },
        _id: false
    },
    token:{
        type: String,
        default: '0'
    },
    document: [documentSchema],
    lastConnection: [lastConSchema]
})

export const usersModel = model('Users', usersSchema)