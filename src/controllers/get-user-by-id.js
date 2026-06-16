import { request } from 'express'
import { GetUserByIdUseCase } from '../use-cases/index.js'
import validator from 'validator'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    badRequest,
    notFound,
    serverError,
    sucess,
} from './helpers/index.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const isIdValid = checkIfIdIsValid(httpRequest.params.userId)

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
