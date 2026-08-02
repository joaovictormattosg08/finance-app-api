import { ZodError } from 'zod'
import { loginUserSchema } from '../../schemas/user'
import {
    badRequest,
    notFound,
    serverError,
    sucess,
    unauthorized,
} from '../helpers/http'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user'

export class LoginUserController {
    constructor(loginUserUseCase) {
        this.loginUserUseCase = loginUserUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await loginUserSchema.parseAsync(params)

            const user = await this.loginUserUseCase.execute(
                params.email,
                params.password,
            )

            return sucess(user)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.erros[0].message,
                })
            }

            if (error instanceof InvalidPasswordError) {
                return unauthorized()
            }

            if (error instanceof UserNotFoundError) {
                return notFound()
            }

            return serverError()
        }
    }
}
