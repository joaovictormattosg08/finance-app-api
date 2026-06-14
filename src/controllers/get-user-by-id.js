import { request } from 'express'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { badRequest, notFound, serverError, sucess } from './helpers.js'
import validator from 'validator'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return badRequest({ message: 'the provided id is not valid' })
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()

            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            )

            if (!user) {
                return notFound({ message: 'User not found' })
            }

            return sucess(user)
        } catch (error) {
            return serverError()
        }
    }
}
