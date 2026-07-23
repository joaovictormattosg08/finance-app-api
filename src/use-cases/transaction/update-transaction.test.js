import { UpdateTransactionUseCase } from './update-transaction'
import { faker } from '@faker-js/faker'
import { transactionParams } from '../../test/index.js'

describe('UpdateTransactionUseCase', () => {
    const id = faker.string.uuid()

    class UpdateTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                id: transactionId,
                ...transactionParams,
            }
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()

        const sut = new UpdateTransactionUseCase(updateTransactionRepository)

        return { sut, updateTransactionRepository }
    }

    it('should create a transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(id, transactionParams)

        expect(result).toEqual({
            id,
            ...transactionParams,
        })
    })

    it('should call UpdateTransactionRepository with correct params', async () => {
        const { sut, updateTransactionRepository } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            updateTransactionRepository,
            'execute',
        )

        await sut.execute(id, transactionParams)

        expect(executeSpy).toHaveBeenCalledWith(id, transactionParams)
    })

    it('should throw if UpdateTransactionRepository throws ', async () => {
        const { sut, updateTransactionRepository } = makeSut()
        import.meta.jest
            .spyOn(updateTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(id, transactionParams)

        await expect(promise).rejects.toThrow(new Error())
    })
})
