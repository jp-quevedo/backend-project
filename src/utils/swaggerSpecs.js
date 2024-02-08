import swaggerJSDOC from 'swagger-jsdoc'
import { __dirname } from './utils.js'

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Backend Test API',
            version: '1.0.0',
            description: 'Coderhouse'
        }
    },
    apis: [`${__dirname}/docs/*.yaml`]
}

export const swaggerSetup = swaggerJSDOC(swaggerOptions)