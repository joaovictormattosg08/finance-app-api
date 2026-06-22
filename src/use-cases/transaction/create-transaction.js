import { UserNotFoundError } from '../../errors/user.js'
import { v4 as uuidv4 } from 'uuid'

export class CreateTransactionUseCase {
    constructor(
        PostgresCreateTransactionRepository,
        PostgresGetUserByIdRepository,
    ) {
        this.PostgresCreateTransactionRepository =
            PostgresCreateTransactionRepository

        this.PostgresGetUserByIdRepository = PostgresGetUserByIdRepository
    }

    async execute(createTransactionParams) {
        const userId = createTransactionParams.user_id

        const user = await this.PostgresGetUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = uuidv4()

        const transaction =
            await this.PostgresCreateTransactionRepository.execute({
                ...createTransactionParams,
                id: transactionId,
            })

        return transaction
    }
}
