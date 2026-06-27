import { UserNotFoundError } from '../../errors/user.js'

export class UpdateTransactionUseCase {
    constructor(
        PostgresUpdateTransactionRepository,
        PostgresGetUserByIdRepository,
    ) {
        this.PostgresUpdateTransactionRepository =
            PostgresUpdateTransactionRepository
        this.PostgresGetUserByIdRepository = PostgresGetUserByIdRepository
    }
    async execute(params) {
        const user = await this.PostgresGetUserByIdRepository.execute(
            params.userId,
        )

        if (!user) {
            throw new UserNotFoundError()
        }

        const transaction =
            await this.PostgresUpdateTransactionRepository.execute(params)

        return transaction
    }
}
