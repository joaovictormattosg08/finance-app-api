import { TransactionNotFoundError } from '../../errors/transaction.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    serverError,
    sucess,
    transactionNotFoundResponse,
} from '../helpers/index.js'

export class DeleteTransactionController {
    constructor(DeleteTransactionUseCase) {
        this.DeleteTransactionUseCase = DeleteTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const transaction = await this.DeleteTransactionUseCase.execute(
                httpRequest.params.transactionId,
            )

            return sucess(transaction)
        } catch (error) {
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }
            console.error(error)
            return serverError()
        }
    }
}
