import { UserNotFoundError } from '../../errors/user.js'
import { createTransactionSchema } from '../../schemas/transaction.js'
import {
    serverError,
    badRequest,
    sucess,
    created,
    userNotFoundResponse,
} from '../helpers/index.js'

import { ZodError } from 'zod'

export class CreateTransactionController {
    constructor(CreateTransactionUseCase) {
        this.CreateTransactionUseCase = CreateTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await createTransactionSchema.parseAsync(params)

            const transaction =
                await this.CreateTransactionUseCase.execute(params)

            return created(transaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            console.error(error)
            return serverError()
        }
    }
}
