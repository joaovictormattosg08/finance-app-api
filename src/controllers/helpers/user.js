import { badRequest } from './statusCode.js'
import validator from 'validator'

export const invalidPasswordResponse = () => {
    badRequest({
        message: 'your password need to have at least 8 characters',
    })
}

export const emailAlreadyInUseResponse = () => {
    badRequest({
        message: 'Invalid e-mail, please provide a valid one.',
    })
}

export const invalidIdResponse = () => {
    badRequest({
        message: 'the provided id is not valid',
    })
}

export const checkIfPasswordIsValid = (password) => password.length > 7

export const checkIfEmailIsValid = (email) => validator.isEmail(email)
