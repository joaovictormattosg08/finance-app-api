import validator from 'validator'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { createUserSchema } from '../../schemas/user.js'
import { badRequest, created, serverError } from '../helpers/index.js'
import { ZodError } from 'zod'

export class CreateUserController {
    constructor(CreateUserUseCase) {
        this.CreateUserUseCase = CreateUserUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            //Validar a requisição (campos obrigatórios e tamanho de senha, email)

            await createUserSchema.parseAsync(params)
            // chamar o use case

            const createdUser = await this.CreateUserUseCase.execute(params)
            //retornar a resposta para o usuário (status code)

            return created({ message: createdUser })
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.log(error)
            return serverError()
        }
    }
}
