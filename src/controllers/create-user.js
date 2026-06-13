import { CreateUserUseCase } from '../use-cases/create-user.js'
import validator from 'validator'
import { badRequest, created, serverError } from './helpers.js'

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
                    return badRequest({ message: `Missing params: ${field}` })
                }
            }

            const passwordIsValid = params.password.length > 7

            if (!passwordIsValid) {
                return badRequest({
                    message: 'your password need to have at least 8 characters',
                })
            }

            const emailIsValid = validator.isEmail(params.email)

            if (!emailIsValid) {
                return badRequest({
                    message: 'Invalid e-mail, please provide a valid one.',
                })
            }

            // chamar o use case
            const createUserUseCase = new CreateUserUseCase()

            const createdUser = await createUserUseCase.execute(params)
            //retornar a resposta para o usuário (status code)

            return created({ message: createdUser })
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
