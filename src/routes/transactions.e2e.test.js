import request from 'supertest'
import { app } from '../app.js'
import { user, transaction } from '../test/fixtures/user.js'
import { transactionParams } from '../test/fixtures/transaction.js'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'
describe('Transaction Routes E2E Tests', () => {
    it('POST /api/transactions should return 201 when creating a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .post('/api/transactions')
            .send({
                ...transactionParams,
                id: undefined,
                user_id: createdUser.id,
            })

        expect(response.status).toBe(201)
        expect(response.status).toBe(201)
        expect(response.body.user_id).toBe(createdUser.id)
        expect(response.body.type).toBe(transactionParams.type)
        expect(response.body.amount).toBe(String(transactionParams.amount))
    })
})
