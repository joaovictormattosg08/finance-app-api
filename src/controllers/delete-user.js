import { DeleteUserUseCase } from '../use-cases/index.js'
import { sucess } from './helpers/http.js'
import { notFound, serverError } from './helpers/http.js'
import { checkIfIdIsValid, invalidIdResponse } from './helpers/user.js'

export class DeleteUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const userId = httpRequest.params.userId

            const idIsValid = checkIfIdIsValid(userId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deletedUserUseCase = new DeleteUserUseCase()

            console.log(userId)

            const deletedUser = await deletedUserUseCase.execute(userId)

            return sucess(deletedUser)
        } catch (error) {
            return serverError()
            console.log(error)
        }
    }
}
