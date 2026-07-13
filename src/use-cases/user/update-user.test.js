import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user'

describe('UpdateUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    const userId = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const updateUserRepository = new UpdateUserRepositoryStub()

        const sut = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        }
    }

    it('should update user successfully (without email and password)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid(), {
            last_name: faker.person.lastName(),
            first_name: faker.person.firstName(),
        })

        expect(result).toBe(user)
    })

    it('should update user successfully (with email)', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByEmailRepository, 'execute')
        const updateEmail = faker.internet.email()

        const result = await sut.execute(faker.string.uuid(), {
            email: updateEmail,
        })

        expect(executeSpy).toHaveBeenCalledWith(updateEmail)
        expect(result).toBe(user)
    })
})
