import {
    checkIfIdIsValid,
    invalidIdResponse,
    notFound,
    serverError,
    sucess,
} from '../helpers/index.js'

export class GetUserByIdController {
    constructor(GetUserByIdUseCase) {
        this.GetUserByIdUseCase = GetUserByIdUseCase
    }

    async execute(httpRequest) {
        try {
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
            console.log(error)
            return serverError()
        }
    }
}
