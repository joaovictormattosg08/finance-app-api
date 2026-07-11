import { faker } from '@faker-js/faker'
import { CreateTransactionController } from './create-transaction.js'
import { fa } from 'zod/locales'
import { date } from 'zod'

describe('CreateTransactionController', () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)

        return { sut, createTransactionUseCase }
    }

    const httpRequest = {
        body: {
            name: faker.string.alphanumeric(10),
            user_id: faker.string.uuid(),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: 'EARNING',
        },
    }

    it('should return 201 when creating transaction successfully (EARNING)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                type: 'EARNING',
            },
        })

        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when creating transaction successfully (EXPENSE)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                type: 'EXPENSE',
            },
        })

        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when creating transaction successfully (INVESTMENT)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                type: 'INVESTMENT',
            },
        })

        expect(result.statusCode).toBe(201)
    })

    it('should return 400 if user_id is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest,
                user_id: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if name is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest,
                name: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if date is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest,
                date: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if amount is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest,
                amount: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if type is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest,
                type: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if the provided date is not valid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest,
                date: 'invalid_date',
            },
        })

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if the provided type is not EARNING, EXPENSE OR INVESTMENT', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest,
                type: 'invalid_type',
            },
        })

        expect(result.statusCode).toBe(400)
    })
})
