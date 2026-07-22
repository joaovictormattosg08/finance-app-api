export class UpdateTransactionUseCase {
    constructor(PostgresUpdateTransactionRepository) {
        this.PostgresUpdateTransactionRepository =
            PostgresUpdateTransactionRepository
    }
    async execute(transactionId, params) {
        const transaction =
            await this.PostgresUpdateTransactionRepository.execute(
                transactionId,
                params,
            )

        return transaction
    }
}
