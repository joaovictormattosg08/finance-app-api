import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'
import jwt from 'jsonwebtoken'

export class LoginUserUseCase {
    constructor(
        getUserByEmailRepository,
        PasswordComparatorAdapter,
        TokenGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.PasswordComparatorAdapter = PasswordComparatorAdapter
        this.TokenGeneratorAdapter = TokenGeneratorAdapter
    }

    async execute(email, password) {
        const user = await this.getUserByEmailRepository.execute(email)

        if (!user) {
            throw new UserNotFoundError()
        }

        const isPasswordValid = await this.PasswordComparatorAdapter.execute(
            password,
            user.password,
        )

        if (!isPasswordValid) {
            throw new InvalidPasswordError()
        }

        return {
            ...user,
            tokens: await this.TokenGeneratorAdapter.execute(user.id),
        }
    }
}
