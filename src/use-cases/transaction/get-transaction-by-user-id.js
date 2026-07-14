import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionByUserIdUseCase {
    constructor(PostgresGetTransactionByUserId, PostgresGetUserByIdRepository) {
        this.PostgresGetTransactionByUserId = PostgresGetTransactionByUserId
        this.PostgresGetUserByIdRepository = PostgresGetUserByIdRepository
    }
    async execute(userId) {
        const user = await this.PostgresGetUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transaction =
            await this.PostgresGetTransactionByUserId.execute(userId)

        return transaction
    }
}
