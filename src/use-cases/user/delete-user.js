import {
    PostgresDeleteUserRepository,
    PostgresGetUserByIdRepository,
} from '../../repositories/postgres/index.js'
import { UserNotFoundError } from '../../errors/user.js'

export class DeleteUserUseCase {
    constructor(PostgresDeleteUserRepository, PostgresGetUserByIdRepository) {
        this.PostgresDeleteUserRepository = PostgresDeleteUserRepository
    }

    async execute(userId) {
        const deletedUser =
            await this.PostgresDeleteUserRepository.execute(userId)

        return deletedUser
    }
}
