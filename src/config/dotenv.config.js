import dotenv from 'dotenv'

dotenv.config()

export default {
    enviroment: process.env.ENVIROMENT,
    gmail_user: process.env.GMAIL_USER,
    gmail_password: process.env.GMAIL_PASSWORD,
    mongo_uri: process.env.MONGO_URI,
    port: process.env.PORT,
    secret_key: process.env.SECRET_KEY,
}