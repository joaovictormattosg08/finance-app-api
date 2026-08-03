import { updateTransactionSchema } from '../../schemas/transaction.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    serverError,
    badRequest,
    sucess,
    transactionNotFoundResponse,
    unauthorized,
    forbidden,
} from '../helpers/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { ForbiddenError } from '../../errors/user.js'
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
            console.error(error)
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }

            if (error instanceof ForbiddenError) {
                return forbidden()
            }

            return serverError()
        }
    }
}
