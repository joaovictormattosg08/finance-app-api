import { faker } from '@faker-js/faker'
import { CreateUserUseCase } from './create-user'
import { EmailAlreadyInUseError } from '../../errors/user'

describe('Create User Use Case', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }
    class CreateUserRepositoryStub {
        async execute(user) {
            return user
        }
    }
    class PasswordHasherAdapterSutb {
        async execute() {
            return 'hashed_password'
        }
    }

    class IdGeneratorAdapterStub {
        async execute() {
            return 'generated_id'
        }
    }

    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }
    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const createUserRepository = new CreateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterSutb()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()

        const sut = new CreateUserUseCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            idGeneratorAdapter,
            createUserRepository,
            passwordHasherAdapter,
        }
    }

    it('should successfully create a user', async () => {
        const { sut } = makeSut()

        const createdUser = await sut.execute(user)

        expect(createdUser).toBeTruthy()
    })

    it('should throw an EmailAlreadyInUseError if getUserByEmailRepository returns a user', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce(
            user,
        )

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call IdGeneratorAdapter to generate a random id ', async () => {
        const { sut, idGeneratorAdapter, createUserRepository } = makeSut()
        const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'execute')
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        await sut.execute(user)

        expect(idGeneratorSpy).toHaveBeenCalled()
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })

    it('should call IdGeneratorAdapter and PasswordHasherAdapter to generate a random id and cryptograph password', async () => {
        const {
            sut,
            idGeneratorAdapter,
            passwordHasherAdapter,
            createUserRepository,
        } = makeSut()
        const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'execute')
        const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, 'execute')
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        await sut.execute(user)

        expect(idGeneratorSpy).toHaveBeenCalled()
        expect(passwordHasherSpy).toHaveBeenCalledWith(user.password)
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if IdGeneratorAdapter throws', async () => {
        const { sut, idGeneratorAdapter } = makeSut()
        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow()
    })
})
