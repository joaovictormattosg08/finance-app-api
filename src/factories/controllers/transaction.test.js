import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionByUserIdController,
    UpdateTransactionController,
} from '../../controllers'
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionByUserIdController,
    makeUpdateTransactionController,
} from './transaction'

describe('Transaction controller Factories', () => {
    it('should return a valid CreateTransactionController instace', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })

    it('should return a valid DeleteTransactionController instace', () => {
        expect(makeDeleteTransactionController()).toBeInstanceOf(
            DeleteTransactionController,
        )
    })

    it('should return a valid GetTransactionsByUserIdController instace', () => {
        expect(makeGetTransactionByUserIdController()).toBeInstanceOf(
            GetTransactionByUserIdController,
        )
    })
})
