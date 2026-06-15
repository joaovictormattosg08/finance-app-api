import validator from 'validator'
import { badRequest, serverError, sucess } from './helpers.js'
import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return badRequest({
                    message: 'the provided id is not valid',
                })
            }

            const updateUserParams = httpRequest.body

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided field is not allowed',
                })
            }

            if (updateUserParams.password) {
                const passwordIsValid = updateUserParams.password.length > 7

                if (!passwordIsValid) {
                    return badRequest({
                        message:
                            'your password need to have at least 8 characters',
                    })
                }
            }

            if (updateUserParams.email) {
                const emailIsValid = validator.isEmail(updateUserParams.email)

                if (!emailIsValid) {
                    return badRequest({
                        message: 'Invalid e-mail, please provide a valid one.',
                    })
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()

            const updatedUser = await updateUserUseCase.execute(
                userId,
                updateUserParams,
            )

            return sucess(updatedUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }

            return serverError()
            console.log(error)
        }
    }
}
