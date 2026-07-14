import { GetTransactionByUserIdUseCase } from './get-transaction-by-user-id'
import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user'

describe('GetTransactionByUserIdUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    class GetTransactionByUserIdRepositoryStub {
        async execute(userId) {
            return []
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getTransactionByUserIdRepository =
            new GetTransactionByUserIdRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()

        const sut = new GetTransactionByUserIdUseCase(
            getTransactionByUserIdRepository,
            getUserByIdRepository,
        )

        return {
            sut,
            getTransactionByUserIdRepository,
            getUserByIdRepository,
        }
    }

    it('should get transactions by user id successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid())

        expect(result).toEqual([])
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)
        const userId = faker.string.uuid()
        const promise = sut.execute(userId)

        await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetTransactionByUserIdRepository with correct params', async () => {
        const { sut, getTransactionByUserIdRepository } = makeSut()
        const executeSpy = jest.spyOn(
            getTransactionByUserIdRepository,
            'execute',
        )
        const id = faker.string.uuid()

        await sut.execute(id)
        expect(executeSpy).toHaveBeenCalledWith(id)
    })

    it('should call GetUserbyIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')
        const id = faker.string.uuid()

        await sut.execute(id)
        expect(executeSpy).toHaveBeenCalledWith(id)
    })
})
