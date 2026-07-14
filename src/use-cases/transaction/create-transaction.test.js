import { CreateTransactionUseCase } from './create-transaction'
import { faker } from '@faker-js/faker'

describe('CreateTransactionUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    const createTransactionParams = {
        id: faker.string.uuid(),
        name: faker.string.alphanumeric(10),
        user_id: faker.string.uuid(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'EARNING',
    }

    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }

    class IdGeneratorAdapterStub {
        async execute() {
            return 'random_id'
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId }
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()

        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        }
    }

    it('should create transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(createTransactionParams)

        expect(result).toEqual({
            ...createTransactionParams,
            id: 'random_id',
        })
    })

    it('should call CreateTransactionRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

        const result = await sut.execute(createTransactionParams)

        expect(executeSpy).toHaveBeenCalledWith(createTransactionParams.user_id)
    })

     it('should call idGeneratorAdapter', async () => {
        const { sut, idGeneratorAdapter } = makeSut()
        const executeSpy = jest.spyOn(idGeneratorAdapter, 'execute')

        const result = await sut.execute(createTransactionParams)

        expect(executeSpy).toHaveBeenCalled()
    })
})
