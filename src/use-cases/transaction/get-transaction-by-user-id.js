import { userNotFoundResponse } from '../../controllers/helpers/user.js'

export class GetTransactionByUserId {
    constructor(PostgresGetTransactionByUserId, PostgresGetUserByIdRepository) {
        this.PostgresGetTransactionByUserId = PostgresGetTransactionByUserId
        this.PostgresGetUserByIdRepository = PostgresGetUserByIdRepository
    }
    async execute(params) {
        const user = await this.PostgresGetUserByIdRepository.execute(
            params.userId,
        )

        if (!user) {
            return userNotFoundResponse
        }

        const transaction = await this.PostgresGetTransactionByUserId.execute(params.userId)

        return transaction
    }
}
