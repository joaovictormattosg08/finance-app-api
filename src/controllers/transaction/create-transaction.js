import { createTransactionSchema } from '../../schemas/transaction.js'
import { serverError, badRequest, sucess, created } from '../helpers/index.js'

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

            console.error(error)
            return serverError()
        }
    }
}
