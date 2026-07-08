import { CreateUserController } from './create-user'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }
    it('Should create an user', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'João',
                last_name: 'Victor',
                email: 'joao@gmail.com',
                password: '12345678',
            },
        }
        //act

        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(201)
        expect(result.body).not.toBeUndefined()
    })

    it('Shoul reaturn 400 if first_name is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                last_name: 'Victor',
                email: 'joao@gmail.com',
                password: '12345678',
            },
        }
        //Act
        const result = await createUserController.execute(httpRequest)

        //Assert
        expect(result.statusCode).toBe(400)
    })

    it('Should return 400 if last_name is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'João',
                email: 'joao@gmail.com',
                password: '12345678',
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //Assert
        expect(result.statusCode).toBe(400)
    })
})
