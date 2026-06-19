import { request } from 'express'
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
    constructor(GetUserByIdUseCase) {
        this.GetUserByIdUseCase = GetUserByIdUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const isIdValid = checkIfIdIsValid(httpRequest.params.userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const user = await this.GetUserByIdUseCase.execute(
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
