import { DeleteTransactionUseCase } from './delete-transaction'
import { faker } from '@faker-js/faker'
import { transaction } from '../../test/index'

describe('DeleteTransactionUseCase', () => {
    class DeleteTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()

        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

        return {
            sut,
            deleteTransactionRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(transaction)

        expect(result).toEqual(transaction)
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        const executeSpy = jest.spyOn(deleteTransactionRepository, 'execute')

        const result = await sut.execute(transaction)

        expect(executeSpy).toHaveBeenCalledWith(transaction)
    })

    it('should throw if DeleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction)

        await expect(promise).rejects.toThrow()
    })
})
