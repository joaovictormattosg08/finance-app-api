import {
    checkIfIdIsValid,
    invalidIdResponse,
    serverError,
    badRequest,
    checkIfAmountIsValid,
    invalidAmountResponse,
    checkIfTypeIsValid,
    invalidTypeResponse,
    sucess,
} from '../helpers/index.js'

export class UpdateTransactionController {
    constructor(UpdateTransactionUseCase) {
        this.UpdateTransactionUseCase = UpdateTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const allowedFields = ['name', 'date', 'amount', 'type']

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided field is not allowed',
                })
            }

            if (params.amount) {
                const amount = checkIfAmountIsValid(params.amount)

                if (!amount) {
                    return invalidAmountResponse()
                }
            }

            if (params.type) {
                const typeIsValid = checkIfTypeIsValid(params.type)

                if (!typeIsValid) {
                    return invalidTypeResponse()
                }
            }

            const transaction = await this.UpdateTransactionUseCase.execute(
                httpRequest.params.transactionId,
                params,
            )

            return sucess(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
