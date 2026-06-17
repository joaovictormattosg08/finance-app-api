import { DeleteUserUseCase } from '../use-cases/index.js'
import { sucess } from './helpers/http.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    notFound,
    serverError,
} from './index.js'

export class DeleteUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const userId = httpRequest.params.userId

            const idIsValid = checkIfIdIsValid(userId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deleteUserUseCase = DeleteUserUseCase()

            const deletedUser = await deleteUserUseCase.execute(userId)

            return sucess(deletedUser)
        } catch (error) {
            return serverError()
            console.log(error)
        }
    }
}
