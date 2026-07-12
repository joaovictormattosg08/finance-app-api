import { faker } from '@faker-js/faker'
import { GetTransactionByUserIdController } from './get-transaction-by-user-id'

describe('GetTransactionByUserIdController', () => {
    class GetTransactionByUserIdUseCaseStub {
        async execute() {
            return [
                {
                    id: faker.string.uuid(),
                    name: faker.string.alphanumeric(10),
                    user_id: faker.string.uuid(),
                    date: faker.date.anytime().toISOString(),
                    amount: Number(faker.finance.amount()),
                    type: 'EARNING',
                },
            ]
        }
    }

    const makeSut = () => {
        const getTransactionByIdUseCase =
            new GetTransactionByUserIdUseCaseStub()

        const sut = new GetTransactionByUserIdController(
            getTransactionByIdUseCase,
        )

        return { sut, getTransactionByIdUseCase }
    }

    const httpRequest = {
        query: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 when finding transactions by user id successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })
})
