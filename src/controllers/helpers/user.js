import { badRequest } from './http.js'
import validator from 'validator'

export const invalidPasswordResponse = () => {
    return badRequest({
        message: 'your password need to have at least 8 characters',
    })
}

export const invalidEmailResponse = () => {
    return badRequest({
        message: 'Invalid e-mail, please provide a valid one.',
    })
}

export const invalidIdResponse = () => {
    return badRequest({
        message: 'the provided id is not valid',
    })
}

export const checkIfPasswordIsValid = (password) => password.length > 7

export const checkIfEmailIsValid = (email) => validator.isEmail(email)

export const checkIfIdIsValid = (userId) => validator.isUUID(userId)
