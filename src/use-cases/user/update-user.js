

import { EmailAlreadyInUseError } from '../../errors/user.js'

export class UpdateUserUseCase {
    constructor(
        PostgresGetUserByEmailRepository,
        PostgresUpdateUserRepository,
        passwordHasherAdapter,
    ) {
        this.PostgresGetUserByEmailRepository = PostgresGetUserByEmailRepository
        this.PostgresUpdateUserRepository = PostgresUpdateUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
    }

    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const userWithProvidedEmail =
                await this.PostgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userWithProvidedEmail) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }

        const user = { ...updateUserParams }

        if (updateUserParams.password) {
            const hashedPassword = await this.passwordHasherAdapter.execute(
                updateUserParams.password,
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
