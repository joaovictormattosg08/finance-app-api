import { faker } from '@faker-js/faker'
import { GetTransactionByUserIdController } from './get-transaction-by-user-id'
import { UserNotFoundError } from '../../errors/user'

describe('GetTransactionByUserIdController', () => {
    class GetTransactionByUserIdUseCaseStub {
        async execute() {
            return []
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
            from: '2025-01-01',
            to: '2025-02-01',
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

        import.meta.jest
            .spyOn(getTransactionByIdUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when getTransactionByIdUseCase throws ', async () => {
        const { sut, getTransactionByIdUseCase } = makeSut()

        import.meta.jest
            .spyOn(getTransactionByIdUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should call GetTransactionByUserIdUseCase with correct params', async () => {
        const { sut, getTransactionByIdUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            getTransactionByIdUseCase,
            'execute',
        )

        const userId = faker.string.uuid()
        const from = '2025-01-01'
        const to = '2025-02-01'

        await sut.execute({
            query: { userId: userId, from, to },
        })

        expect(executeSpy).toHaveBeenCalledWith(userId, from, to)
    })
})
