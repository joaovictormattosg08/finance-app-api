import { faker } from '@faker-js/faker'
import { CreateUserController } from './create-user'
import { EmailAlreadyInUseError } from '../../errors/user'
import { user } from '../../test'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute() {
            return user
        }
    }

    //SUT -> Suit Under Test
    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const sut = new CreateUserController(createUserUseCase)

        return { createUserUseCase, sut }
    }

    const httpRequest = {
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        },
    }

    it('Should return 201 when creating a user successfully', async () => {
        // arrange
        const { sut } = makeSut()
        //act

        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(201)
        // expect(result.body).toEqual(httpRequest.body)
    })

    it('Shoul return 400 if first_name is not provided', async () => {
        //arrange
        const { sut } = makeSut()

        //Act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                first_name: undefined,
            },
        })

        //Assert
        expect(result.statusCode).toBe(400)
    })

    it('Should return 400 if last_name is not provided', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                last_name: undefined,
            },
        })

        //Assert
        expect(result.statusCode).toBe(400)
    })
    it('Should return 400 if email is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                email: undefined,
            },
        })

        //Assert
        expect(result.statusCode).toBe(400)
    })
    it('Should return 400 if has an invalid email', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
        })

        //Assert
        expect(result.statusCode).toBe(400)
    })
    it('should return 400 if password is not provided', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                password: undefined,
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 characters', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                password: faker.internet.password({
                    length: 5,
                }),
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('Should call CreateUserUseCase with correct params', async () => {
        // arrange
        const { sut, createUserUseCase } = makeSut()

        const executeSpy = jest.spyOn(createUserUseCase, 'execute')

        //act
        const result = await sut.execute(httpRequest)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    it('should return 500 if CreateUserUseCase throws', async () => {
        const { sut, createUserUseCase } = makeSut()
        //arrange

        jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })
        //act

        const result = await sut.execute(httpRequest)
        //assert

        expect(result.statusCode).toBe(500)
    })

    it('should return 500 if CreateUserUseCase throws Email Already in use', async () => {
        //arrange
        const { sut, createUserUseCase } = makeSut()

        jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new EmailAlreadyInUseError(httpRequest.body.email)
        })
        //act
        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
    })
})
