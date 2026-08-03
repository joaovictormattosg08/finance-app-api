import { ForbiddenError } from '../../errors/user.js'

export class UpdateTransactionUseCase {
    constructor(
        PostgresUpdateTransactionRepository,
        PostgresGetTransactionByIdRepository,
    ) {
        this.PostgresUpdateTransactionRepository =
            PostgresUpdateTransactionRepository
        this.PostgresGetTransactionByIdRepository =
            PostgresGetTransactionByIdRepository
    }
    async execute(transactionId, params) {
        const transaction =
            await this.PostgresGetTransactionByIdRepository.execute(
                transactionId,
            )

        if (params?.userId && transaction.user_id !== params.user_id) {
            throw new ForbiddenError()
        }

        return await this.PostgresUpdateTransactionRepository.execute(
            transactionId,
            params,
        )
    }
}
