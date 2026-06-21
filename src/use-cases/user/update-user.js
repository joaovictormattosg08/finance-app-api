import bcrypt from 'bcrypt'
import {
    PostgresGetUserByEmailRepository,
    PostgresUpdateUserRepository,
} from '../../repositories/postgres/index.js'
import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user.js'

export class UpdateUserUseCase {
    constructor(
        PostgresGetUserByEmailRepository,
        PostgresUpdateUserRepository,
        PostgresGetUserByIdRepository,
    ) {
        this.PostgresGetUserByEmailRepository = PostgresGetUserByEmailRepository
        this.PostgresUpdateUserRepository = PostgresUpdateUserRepository
        this.PostgresGetUserByIdRepository = PostgresGetUserByIdRepository
    }

    async execute(userId, updateUserParams) {
        console.log(this.PostgresGetUserByIdRepository)
        if (updateUserParams.email) {
            const userWithProvidedEmail =
                await this.PostgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userWithProvidedEmail) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }

        const userExists =
            await this.PostgresGetUserByIdRepository.execute(userId)

        if (!userExists) {
            throw new UserNotFoundError(userId)
        }

        const user = { ...updateUserParams }

        if (updateUserParams.password) {
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            )

            user.password = hashedPassword
        }

        const updatedUser = await this.PostgresUpdateUserRepository.execute(
            userId,
            user,
        )

        return updatedUser
    }
}
