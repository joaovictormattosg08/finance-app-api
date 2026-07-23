import { DeleteTransactionUseCase } from './delete-transaction'
import { transactionParams } from '../../test/index'

describe('DeleteTransactionUseCase', () => {
    class DeleteTransactionRepositoryStub {
        async execute() {
            return transactionParams
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

        const result = await sut.execute(transactionParams)

        expect(result).toEqual(transactionParams)
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )

        await sut.execute(transactionParams)

        expect(executeSpy).toHaveBeenCalledWith(transactionParams)
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
