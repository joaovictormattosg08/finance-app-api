import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionByUserIdUseCase {
    constructor(PostgresGetTransactionByUserId, PostgresGetUserByIdRepository) {
        this.PostgresGetTransactionByUserId = PostgresGetTransactionByUserId
        this.PostgresGetUserByIdRepository = PostgresGetUserByIdRepository
    }
    async execute(params) {
        const user = await this.PostgresGetUserByIdRepository.execute(
            params.userId,
        )

        if (!user) {
            throw new UserNotFoundError(params.userId)
        }

        const transaction = await this.PostgresGetTransactionByUserId.execute(
            params.userId,
        )

        return transaction
    }
}
