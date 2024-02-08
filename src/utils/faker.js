import { faker } from '@faker-js/faker'

export const generateProduct = () => {
    const product = {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        price: faker.commerce.price({ min: 100, max: 1000, dec: 0}),
        category: faker.commerce.department(),
        stock: faker.number.int(100)
    }
    return product
}