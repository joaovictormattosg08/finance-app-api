import { UpdateTransactionUseCase } from './update-transaction'
import { faker } from '@faker-js/faker'

describe('UpdateTransactionUseCase', () => {
    const transaction = {
        id: faker.string.uuid(),
        name: faker.string.alphanumeric(10),
        user_id: faker.string.uuid(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'EARNING',
    }

    const id = faker.string.uuid()

    class UpdateTransactionRepositoryStub {
        async execute(transactionId, params) {
            return {
                id: transactionId,
                ...transaction,
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

        const result = await sut.execute(id, transaction)

        expect(result).toEqual({
            id,
            ...transaction,
        })
    })

    it('should call UpdateTransactionRepository with correct params', async () => {
        const { sut, updateTransactionRepository } = makeSut()
        const executeSpy = jest.spyOn(updateTransactionRepository, 'execute')

        const result = await sut.execute(id, transaction)

        expect(executeSpy).toHaveBeenCalledWith(id, transaction)
    })

    it('should throw if UpdateTransactionRepository throws ', async () => {
        const { sut, updateTransactionRepository } = makeSut()
        jest.spyOn(
            updateTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(id, transaction)

        await expect(promise).rejects.toThrow(new Error())
    })
})
