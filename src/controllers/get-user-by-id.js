import { request } from 'express'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import {
    badRequest,
    notFound,
    serverError,
    sucess,
} from './helpers/statusCode.js'
import validator from 'validator'
import { invalidIdResponse } from './helpers/user.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return invalidIdResponse()
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
