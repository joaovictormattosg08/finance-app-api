import {
    serverError,
    badRequest,
    checkIfIdIsValid,
    invalidIdResponse,
} from '../helpers'
import validator from 'validator'

export class CreateTransactionController {
    constructor(CreateTransactionUseCase) {
        this.CreateTransactionUseCase = CreateTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requiredFields = [
                'id',
                'user_id',
                'name',
                'date',
                'amount',
                'type',
            ]

            // For que acessa cada um dos campos do create user definidos acima
            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length == 0) {
                    return badRequest({ message: `Missing params: ${field}` })
                }
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            if (params.amount <= 0) {
                return badRequest({
                    message: 'Amount must be grater than 0',
                })
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

            const typeIsValid = ![
                'EARNING',
                'EXPENSE',
                'INVESTMENT'.includes(type),
            ]

            if (!typeIsValid) {
                return badRequest({
                    message: 'The type must be EARNING,EXPENSE OR INVESTMENT.',
                })
            }

            const transaction = await this.CreateTransactionUseCase.execute({
                ...params,
                type,
            })
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
