import { ZodError } from 'zod'
import { UserNotFoundError } from '../../errors/user.js'
import { getUserBalanceSchema } from '../../schemas/user.js'
import {
    serverError,
    sucess,
    userNotFoundResponse,
    badRequest,
} from '../helpers/index.js'

export class GetUserBalanceController {
    constructor(GetUserBalanceUseCase) {
        this.GetUserBalanceUseCase = GetUserBalanceUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            await getUserBalanceSchema.parseAsync({
                user_id: userId,
                from,
                to,
            })

            const balance = await this.GetUserBalanceUseCase.execute(
                userId,
                from,
                to,
            )

            return sucess(balance)
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
