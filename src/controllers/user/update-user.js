import validator from 'validator'
import { updateUserSchema } from '../../schemas/user.js'
import { UpdateUserUseCase } from '../../use-cases/index.js'
import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user.js'
import {
    invalidIdResponse,
    checkIfIdIsValid,
    badRequest,
    serverError,
    sucess,
} from '../helpers/index.js'
import { ZodError } from 'zod'

export class UpdateUserController {
    constructor(UpdateUserUseCase) {
        this.UpdateUserUseCase = UpdateUserUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const userId = httpRequest.params.userId

            const isIdValid = checkIfIdIsValid(httpRequest.params.userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            await updateUserSchema.parseAsync(params)

            const updatedUser = await this.UpdateUserUseCase.execute(
                userId,
                params,
            )

            return sucess(updatedUser)
        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }

            if (error instanceof UserNotFoundError) {
                return badRequest({ message: error.message })
            }

            return serverError()
        }
    }
}
