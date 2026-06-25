import { serverError, sucess } from '../helpers/http.js'
import { userNotFoundResponse } from '../helpers/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    requiredFieldIsMissingResponse,
} from '../helpers/validation.js'

export class GetTransactionByUserIdController {
    constructor(GetTransactionByUserIdUseCase) {
        this.GetTransactionByUserIdUseCase = GetTransactionByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId

            if (!userId) {
                return requiredFieldIsMissingResponse()
            }

            const userIdIsValid = checkIfIdIsValid(userId)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            const transactions =
                await this.GetTransactionByUserIdUseCase.execute({
                    userId,
                })

            return sucess(transactions)
        } catch (error) {
            console.log(error)
            if (error instanceof userNotFoundError) {
                return userNotFoundResponse()
            }
            return serverError()
        }
    }
}
