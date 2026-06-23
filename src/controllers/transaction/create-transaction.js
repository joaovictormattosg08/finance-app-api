import {
    serverError,
    badRequest,
    checkIfIdIsValid,
    invalidIdResponse,
    sucess,
    validateRequiredFields,
    requiredFieldIsMissingResponse,
} from '../helpers/index.js'
import validator from 'validator'

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

            const amountIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digits_after_decimal: [2],
                    allow_negatives: false,
                    decimal_separator: '.',
                },
            )

            if (!amountIsValid) {
                return badRequest({
                    message: 'The amount must be a valid currency',
                })
            }

            const type = params.type.trim().toUpperCase()

            const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(
                type,
            )

            if (!typeIsValid) {
                return badRequest({
                    message: 'The type must be EARNING, EXPENSE or INVESTMENT.',
                })
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
