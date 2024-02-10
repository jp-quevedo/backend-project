import { Schema, model, SchemaTypes } from 'mongoose'

const documentSchema = new Schema({
    name: { type: String },
    reference: { type: String }
})

const lastConSchema = new Schema({
    
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
    lastConnection: {
            date:{
                type: Date,
            },
            action:{
                type: String,
                enum: ['login', 'logout'],
            },
            _id: false
        },
    document: [documentSchema]
})

export const usersModel = model('Users', usersSchema)