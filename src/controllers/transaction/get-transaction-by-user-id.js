import { serverError, sucess, badRequest } from '../helpers/http.js'
import { userNotFoundResponse } from '../helpers/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    requiredFieldIsMissingResponse,
} from '../helpers/validation.js'

import { UserNotFoundError } from '../../errors/user.js'
import { getTransactionByUserIdSchema } from '../../schemas/transaction.js'
import { ZodError } from 'zod'

export class GetTransactionByUserIdController {
    constructor(GetTransactionByUserIdUseCase) {
        this.GetTransactionByUserIdUseCase = GetTransactionByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            await getTransactionByUserIdSchema.parseAsync({
                user_id: userId,
                from,
                to,
            })

            const transactions =
                await this.GetTransactionByUserIdUseCase.execute(
                    userId,
                    from,
                    to,
                )

            return sucess(transactions)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            return serverError()
        }
    }
}
