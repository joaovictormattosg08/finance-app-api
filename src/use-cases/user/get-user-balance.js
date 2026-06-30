import { UserNotFoundError } from '../../errors/user.js'

export class GetUserBalanceUseCase {
    constructor(
        PostgresGetUserBalanceRepository,
        PostgresGetUserByIdRepository,
    ) {
        this.PostgresGetUserBalanceRepository = PostgresGetUserBalanceRepository
        this.PostgresGetUserByIdRepository = PostgresGetUserByIdRepository
    }
    async execute(params) {
        const user = await this.PostgresGetUserByIdRepository.execute(
            params.userId,
        )

        if (!user) {
            throw new UserNotFoundError(params.userId)
        }

        const balance = await this.PostgresGetUserBalanceRepository.execute(
            params.userId,
        )

        return balance
    }
}
