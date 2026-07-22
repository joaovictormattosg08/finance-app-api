import { faker } from '@faker-js/faker'
import { GetTransactionByUserIdController } from './get-transaction-by-user-id'
import { UserNotFoundError } from '../../errors/user'
import { transaction } from '../../test'

describe('GetTransactionByUserIdController', () => {
    class GetTransactionByUserIdUseCaseStub {
        async execute() {
            return [transaction]
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

    it('should return 400 if userId is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            query: {
                userId: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if provided userId is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            query: {
                userId: 'invalid_userId',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if user is not found ', async () => {
        const { sut, getTransactionByIdUseCase } = makeSut()

        jest.spyOn(getTransactionByIdUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when getTransactionByIdUseCase throws ', async () => {
        const { sut, getTransactionByIdUseCase } = makeSut()

        jest.spyOn(getTransactionByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should call GetTransactionByUserIdUseCase with correct params', async () => {
        const { sut, getTransactionByIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getTransactionByIdUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.query.userId)
    })
})
