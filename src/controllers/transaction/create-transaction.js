import {
    serverError,
    badRequest,
    checkIfIdIsValid,
    invalidIdResponse,
    sucess,
    validateRequiredFields,
    requiredFieldIsMissingResponse,
    checkIfAmountIsValid,
    checkIfTypeIsValid,
    invalidAmountResponse,
    invalidTypeResponse,
} from '../helpers/index.js'

export class CreateTransactionController {
    constructor(CreateTransactionUseCase) {
        this.CreateTransactionUseCase = CreateTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            // For que acessa cada um dos campos do create user definidos acima
            const { ok: requireFieldsWereProvided, missingField } =
                validateRequiredFields(params, requiredFields)

            if (!requireFieldsWereProvided) {
                return requiredFieldIsMissingResponse(missingField)
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            const amountIsValid = checkIfAmountIsValid(params.amount)

            if (!amountIsValid) {
                return invalidAmountResponse()
            }

            const type = params.type.trim().toUpperCase()

            const typeIsValid = checkIfTypeIsValid(type)

            if (!typeIsValid) {
                return invalidTypeResponse()
            }

            const transaction = await this.CreateTransactionUseCase.execute({
                ...params,
                type,
            })

            return sucess(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
