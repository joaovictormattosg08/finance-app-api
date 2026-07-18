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

    it('GET /api/transactions?userId should return 200 when fetching transactions successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({
                ...transactionParams,
                id: undefined,
                user_id: createdUser.id,
            })

        const response = await request(app).get(
            `/api/transactions?userId=${createdUser.id}`,
        )

        expect(response.status).toBe(200)
        expect(response.body[0].id).toBe(createdTransaction.id)
    })

    it('PATCH /api/transactions/:transactionId should return 200 when update transactions successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({
                ...transactionParams,
                id: undefined,
                user_id: createdUser.id,
            })

        const response = await request(app)
            .patch(`/api/transactions/${createdTransaction.id}`)
            .send({ amount: 100 })

        expect(response.status).toBe(200)
        expect(response.body.amount).toBe('100')
    })

    it('DELETE /api/transactions/:transactionId should return 200 when delete transactions successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({
                ...transactionParams,
                id: undefined,
                user_id: createdUser.id,
            })

        const response = await request(app).delete(
            `/api/transactions/${createdTransaction.id}`,
        )

        expect(response.status).toBe(200)
    })

    it('PATCH /api/transactions/:transactionId should return 404 when updating a non-existing transaction', async () => {
        const response = await request(app)
            .patch(`/api/transactions/${faker.string.uuid()}`)
            .send({ amount: 100 })

        expect(response.status).toBe(404)
    })
})
