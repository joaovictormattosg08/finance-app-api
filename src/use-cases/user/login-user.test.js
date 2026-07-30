import { LoginUserUseCase } from './login-user'
import { user } from '../../test/fixtures/user'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user'

describe('Login user use case', () => {
    class getUserByEmailRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordComparatorAdapterStub {
        async execute() {
            return true
        }
    }

    class TokenGeneratorAdapterStub {
        async execute() {
            return { acessToken: 'any_token', refreshToken: 'any_token' }
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new getUserByEmailRepositoryStub()
        const passwordComparatorAdapterStub =
            new PasswordComparatorAdapterStub()

        const tokenGeneratorAdapterStub = new TokenGeneratorAdapterStub()
        const sut = new LoginUserUseCase(
            getUserByEmailRepository,
            passwordComparatorAdapterStub,
            tokenGeneratorAdapterStub,
        )

        return {
            sut,
            getUserByEmailRepository,
            passwordComparatorAdapterStub,
            tokenGeneratorAdapterStub,
        }
    }

    it('should throw UserNotFoundError if user is not found', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockResolvedValueOnce(null)

        const promise = sut.execute('inexistent_email', 'wrong_password')

        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    it('should throw InvalidPasswordError if password is invalid', async () => {
        const { sut, passwordComparatorAdapterStub } = makeSut()
        import.meta.jest
            .spyOn(passwordComparatorAdapterStub, 'execute')
            .mockReturnValueOnce(false)

        const promise = sut.execute('inexistent_email', 'wrong_password')

        await expect(promise).rejects.toThrow(new InvalidPasswordError())
    })

    it('should return user with tokens', async () => {
        const { sut } = makeSut()
        const result = await sut.execute('any_email', 'any_password')
        expect(result.tokens.acessToken).toBeDefined()
    })
})
