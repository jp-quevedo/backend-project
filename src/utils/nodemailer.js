import config from '../config/dotenv.config.js'
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.gmail_user,
        pass: config.gmail_password,
    }
})