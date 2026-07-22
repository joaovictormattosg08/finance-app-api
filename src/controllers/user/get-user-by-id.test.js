import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id'
import { user } from '../../test'

describe('GetUserByIdController', () => {
    class getUserByIdUseCaseStub {
        async execute() {
            return user
        }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    const makeSut = () => {
        const getUserByIdUseCase = new getUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return { sut, getUserByIdUseCase }
    }

    it('should return 200 if a user is found', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: {
                userId: faker.string.uuid(),
            },
        })

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if a invalid user id is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if a user is not found', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(null)

        const result = await sut.execute({
            params: {
                userId: faker.string.uuid(),
            },
        })

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if getUserByIdUseCase throws ', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute({
            params: {
                userId: faker.string.uuid(),
            },
        })

        expect(result.statusCode).toBe(500)
    })

    it('should calls getUserByIdUseCase with correct params ', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})
