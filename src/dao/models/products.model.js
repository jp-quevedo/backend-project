import mongoosePaginate from 'mongoose-paginate-v2'
import { Schema, SchemaTypes, model } from 'mongoose'

const productsSchema = new Schema({
    title:{
        type: String,
        required: true,
        unique: true,
    },
    description:{
        type: String,
        required: true,
    },
    code:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    status:{
        type: Boolean,
        required: true,
    },
    stock:{
        type: Number,
        default: 0,
    },
    category:{
        type: String,
        required: true,
    },
    owner:{
        email:{
            type: String,
            ref: 'Users',
            default: 'admin@admin.com'
        },
        _id: false
    }
})

productsSchema.plugin(mongoosePaginate)
export const productsModel = model('Products', productsSchema)