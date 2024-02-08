import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = join(dirname(__filename), '..')

export const hashData = async (data) => {
    const hash = await bcrypt.hash(data, 10)
    return hash
}

export const compareData = async (data, hashData) => {
    return bcrypt.compare(data, hashData)
}