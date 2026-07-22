import { badRequest } from './http.js'
import validator from 'validator'

export const checkIfIdIsValid = (userId) => validator.isUUID(userId)

export const invalidIdResponse = () => {
    return badRequest({
        message: 'the provided id is not valid',
    })
}

export const requiredFieldIsMissingResponse = (field) => {
    return badRequest({
        message: `The field ${field} is required`,
    })
}
