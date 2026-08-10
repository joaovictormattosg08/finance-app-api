import { TransactionNotFoundError } from '../../errors/transaction.js'
import { ForbiddenError } from '../../errors/user.js'

export class DeleteTransactionUseCase {
    constructor(
        PostgresDeleteTransactionRepository,
        PostgresGetTransactionByIdRepository,
    ) {
        this.PostgresGetTransactionByIdRepository =
            PostgresGetTransactionByIdRepository

        this.PostgresDeleteTransactionRepository =
            PostgresDeleteTransactionRepository
    }
    async execute(transactionId, userId) {
        const transaction =
            await this.PostgresGetTransactionByIdRepository.execute(
                transactionId,
            )

        if (!transaction) {
            throw new TransactionNotFoundError()
        }

        if (transaction.user_id !== userId) {
            throw new ForbiddenError()
        }

        const deletedTransaction =
            await this.PostgresDeleteTransactionRepository.execute(
                transactionId,
            )

        return deletedTransaction
    }
}
