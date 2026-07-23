import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './get-user-balance'
import { UserNotFoundError } from '../../errors/user'

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

    it('Should return 500 if getUserBalanceUseCase throws', async () => {
        const { sut, getUserBalanceUseCase } = makeSut()
        import.meta.jest
            .spyOn(getUserBalanceUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should return 404 if GetUserBalaceUseCase throws UserNotFoundError', async () => {
        const { sut, getUserBalanceUseCase } = makeSut()
        import.meta.jest
            .spyOn(getUserBalanceUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        const result = await sut.execute(httpRequest)
        expect(result.statusCode).toBe(404)
    })
    it('should calls getUserBalanceUseCase with correct params ', async () => {
        const { sut, getUserBalanceUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            getUserBalanceUseCase,
            'execute',
        )

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})
