import { DeleteUserUseCase } from '../../use-cases/index.js'
import { sucess } from '../helpers/http.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    notFound,
    serverError,
    badRequest,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'

export class DeleteUserController {
    constructor(DeleteUserUseCase) {
        this.DeleteUserUseCase = DeleteUserUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const userId = httpRequest.params.userId

            const idIsValid = checkIfIdIsValid(userId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deletedUser = await this.DeleteUserUseCase.execute(userId)

            return sucess(deletedUser)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return badRequest({ message: error.message })
            }

            return serverError()
        }
    }
}
