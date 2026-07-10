import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './get-user-balance'

describe('GetUserBalanceController', () => {
    class GetUserBalanceUseCaseStub {
        async execute() {
            return faker.number.int()
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
        const sut = new GetUserBalanceController(getUserBalanceUseCase)

        return { sut, getUserBalanceUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('Should return 200 when getting user balance', async () => {
        const { sut } = makeSut()

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
    })

    it('Should return 400 when user id is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: {
                userId: 'Invalid user id',
            },
        })

        expect(result.statusCode).toBe(400)
    })
})
