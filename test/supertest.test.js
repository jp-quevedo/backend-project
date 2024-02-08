import supertest from 'supertest'
import { expect } from 'chai'

const requester = supertest('http://localhost:8080')

describe('sessions endpoints', () => {

    it('should fail to register existing user', async () => {

        const signupUser = {
            name: 'signupTest',
            email: 'jpablo58@live.cl',
            password: 1234,
            role: 'user'
        }

        const { statusCode, body } = await requester
            .post('/api/sessions/signup')
            .send(signupUser)
    
        expect(statusCode).to.equal(401)
        expect(body).to.deep.equal({message: 'User already registered'})

    })

    it('should login and then logout with the given credentials', async () => {

        const loginUser = {
            email: 'test@mail.com',
            password: 1234,
        }

        const { statusCode } = await requester
            .post('/api/sessions/login')
            .send(loginUser)
        
        expect(statusCode).to.equal(200)

        const { statusCode: logoutStatusCode } = await requester
            .post('/api/sessions/logout')
        
        expect(logoutStatusCode).to.equal(201)

    })

})