import {
    badRequest,
    sucess,
    serverError,
    unauthorized,
} from '../helpers/index.js'
import { UnauthorizedError } from '../../errors/user.js'
import { refreshTokenSchema } from '../../schemas/user.js'
import { ZodError } from 'zod'

export class RefreshTokenController {
    constructor(refreshTokenUseCase) {
        this.refreshTokenUseCase = refreshTokenUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            await refreshTokenSchema.parseAsync(params)
            const response = this.refreshTokenUseCase.execute(
                params.refreshToken,
            )
            return sucess(response)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof UnauthorizedError) {
                return unauthorized()
            }
            return serverError()
        }
    }
}
