import { DeleteTransactionUseCase } from './delete-transaction'
import { transactionParams } from '../../test/index'
import { faker } from '@faker-js/faker'

describe('DeleteTransactionUseCase', () => {
    const user_id = faker.string.uuid()
    class DeleteTransactionRepositoryStub {
        async execute() {
            return { ...transactionParams, user_id }
        }
    }

    class PostgresGetTransactionByIdRepositoryStub {
        async execute() {
            return { ...transactionParams, user_id }
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const postgresGetTransactionByIdRepository =
            new PostgresGetTransactionByIdRepositoryStub()

        const sut = new DeleteTransactionUseCase(
            deleteTransactionRepository,
            postgresGetTransactionByIdRepository,
        )

        return {
            sut,
            deleteTransactionRepository,
            postgresGetTransactionByIdRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(transactionParams.id, user_id)

        expect(result).toEqual({
            ...transactionParams,
            user_id: user_id,
        })
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )

        await sut.execute(transactionParams.id, user_id)

        expect(executeSpy).toHaveBeenCalledWith(transactionParams.id)
    })

    it('should throw if DeleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transactionParams)

        await expect(promise).rejects.toThrow()
    })
})
