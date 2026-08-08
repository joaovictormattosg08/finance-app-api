import { UserNotFoundError } from '../../errors/user.js'

export class GetUserBalanceUseCase {
    constructor(
        PostgresGetUserBalanceRepository,
        PostgresGetUserByIdRepository,
    ) {
        this.PostgresGetUserBalanceRepository = PostgresGetUserBalanceRepository
        this.PostgresGetUserByIdRepository = PostgresGetUserByIdRepository
    }
    async execute(userId, from, to) {
        const user = await this.PostgresGetUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const balance = await this.PostgresGetUserBalanceRepository.execute(
            userId,
            from,
            to,
        )

        return balance
    }
}
