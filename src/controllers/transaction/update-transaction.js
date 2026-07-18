import { updateTransactionSchema } from '../../schemas/transaction.js'
import { updateUserSchema } from '../../schemas/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    serverError,
    badRequest,
    sucess,
    transactionNotFoundResponse,
} from '../helpers/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { ZodError } from 'zod'

export class UpdateTransactionController {
    constructor(UpdateTransactionUseCase) {
        this.UpdateTransactionUseCase = UpdateTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const transactionId = httpRequest.params.transactionId

            const idIsValid = checkIfIdIsValid(transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            await updateTransactionSchema.parseAsync(params)

            const transaction = await this.UpdateTransactionUseCase.execute(
                transactionId,
                params,
            )

            return sucess(transaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }

            console.error(error)
            return serverError()
        }
    }
}
