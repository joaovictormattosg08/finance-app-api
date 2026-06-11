import { CreateUserUseCase } from '../use-cases/create-user.js'

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            //Validar a requisição (campos obrigatórios e tamanho de senha, email)
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            console.log(params)

            // For que acessa cada um dos campos do create user definidos acima
            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length == 0) {
                    return {
                        statusCode: 400,
                        body: {
                            message: `Missing params: ${field}`,
                        },
                    }
                }
            }
            // chamar o use case
            const createUserUseCase = new CreateUserUseCase()

            const createdUser = await createUserUseCase.execute(params)
            //retornar a resposta para o usuário (status code)

            return {
                statusCode: 201,
                body: createdUser,
            }
        } catch (error) {
            console.log(error)
            return {
                statusCode: 500,
                body: {
                    message: `Internal server error`,
                },
            }
        }
    }
}
