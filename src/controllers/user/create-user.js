import validator from 'validator'
import {} from '../helpers/http.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    invalidEmailResponse,
    invalidPasswordResponse,
    badRequest,
    created,
    serverError,
    validateRequiredFields,
    requiredFieldIsMissingResponse,
} from '../helpers/index.js'

export class CreateUserController {
    constructor(CreateUserUseCase) {
        this.CreateUserUseCase = CreateUserUseCase
    }

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

            const { ok: requireFieldsWereProvided, missingField } =
                validateRequiredFields(params, requiredFields)

            if (!requireFieldsWereProvided) {
                return requiredFieldIsMissingResponse(missingField)
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password)

            if (!passwordIsValid) {
                return invalidPasswordResponse(params.password)
            }

            const emailIsValid = checkIfEmailIsValid(params.email)

            if (!emailIsValid) {
                return invalidEmailResponse(params.email)
            }
            // chamar o use case

            const createdUser = await this.CreateUserUseCase.execute(params)
            //retornar a resposta para o usuário (status code)

            return created({ message: createdUser })
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }

            console.log(error)
            return serverError()
        }
    }
}
