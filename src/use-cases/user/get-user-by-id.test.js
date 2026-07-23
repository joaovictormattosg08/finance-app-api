import { GetUserByIdUseCase } from './get-user-by-id'
import { faker } from '@faker-js/faker'
import { user } from '../../test'

describe('GetUserByIdUseCase', () => {
    const userId = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserByIdUseCase(getUserByIdRepository)

        return {
            getUserByIdRepository,
            sut,
        }
    }

    it('should get a user by id successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(userId)

        expect(result).toEqual(user)
    })

    it('should call getUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        await sut.execute(userId)

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if getUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const result = sut.execute(userId)

        await expect(result).rejects.toThrow()
    })
})
