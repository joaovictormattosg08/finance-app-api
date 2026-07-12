import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction'

describe('UpdateTransactionController', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                name: faker.string.alphanumeric(10),
                user_id: faker.string.uuid(),
                date: faker.date.anytime().toISOString(),
                amount: Number(faker.finance.amount()),
                type: 'EARNING',
            }
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)

        return { sut, updateTransactionUseCase }
    }

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            name: faker.string.alphanumeric(10),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: 'EARNING',
        },
    }

    it('should return 200 if transaction is successfully updated', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if provided transaction id is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest.body,
            params: {
                transactionId: 'invalid_id',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if some provided field is not allowed', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                unallowed_field: 'some_value',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when amount is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                amount: 'invalid_amount',
            },
        })

        expect(result.statusCode).toBe(400)
    })
})
