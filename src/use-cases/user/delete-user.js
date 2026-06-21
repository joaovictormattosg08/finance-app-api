import {
    PostgresDeleteUserRepository,
    PostgresGetUserByIdRepository,
} from '../../repositories/postgres/index.js'
import { UserNotFoundError } from '../../errors/user.js'

export class DeleteUserUseCase {
    constructor(PostgresDeleteUserRepository, PostgresGetUserByIdRepository) {
        this.PostgresDeleteUserRepository = PostgresDeleteUserRepository
        this.PostgresGetUserByIdRepository = PostgresGetUserByIdRepository
    }

    async execute(userId) {
        const userExists =
            await this.PostgresGetUserByIdRepository.execute(userId)

        if (!userExists) {
            throw new UserNotFoundError(userId)
        }

        const deletedUser =
            await this.PostgresDeleteUserRepository.execute(userId)

        return deletedUser
    }
}
