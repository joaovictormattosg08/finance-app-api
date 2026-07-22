import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction'
import { transaction } from '../../test'

describe('UpdateTransactionController', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return {
                transaction,
            }
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)

        return { sut, updateTransactionUseCase }
    }

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            name: faker.string.alphanumeric(10),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: 'EARNING',
        },
    }

    it('should return 200 if transaction is successfully updated', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if provided transaction id is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest.body,
            params: {
                transactionId: 'invalid_id',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if some provided field is not allowed', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                unallowed_field: 'some_value',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when amount is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                amount: 'invalid_amount',
            },
        })

        expect(result.statusCode).toBe(400)
    })
    it('should return 400 when type is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                type: 'invalid_type',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if UpdateTransactionUseCase throws', async () => {
        const { sut, updateTransactionUseCase } = makeSut()
        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('Should call DeleteTransactionUseCase with correct params', async () => {
        // arrange
        const { sut, updateTransactionUseCase } = makeSut()

        const executeSpy = jest.spyOn(updateTransactionUseCase, 'execute')

        //act
        await sut.execute(httpRequest)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
            httpRequest.body,
        )
    })
})
