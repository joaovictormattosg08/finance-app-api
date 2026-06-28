export class DeleteTransactionUseCase {
    constructor(PostgresDeleteTransactionRepository) {
        this.PostgresDeleteTransactionRepository =
            PostgresDeleteTransactionRepository
    }
    async execute(transactionId) {
        const transaction =
            await this.PostgresDeleteTransactionRepository.execute(
                transactionId,
            )

        return transaction
    }
}
