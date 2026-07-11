import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction'

describe('DeleteTransactionController', () => {
    class DeleteTransactionUseCaseStub {
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
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)

        return { sut, deleteTransactionUseCase }
    }

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
    }

    it('should return 200 when transaction is successfully deleted', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when invalid transaction id is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: {
                transactionId: 'invalid_id',
            },
        })

        expect(result.statusCode).toBe(400)
    })
})
