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

export const checkIfIsString = (value) => typeof value == 'string'

export const validateRequiredFields = (params, requiredFields) => {
    for (const field of requiredFields) {
        const fieldIsMissing = !params[field]
        const fieldIsEmpty =
            !params[field] ||
            (checkIfIsString(params[field]) &&
                validator.isEmpty(params[field], {
                    ignore_whitespace: true,
                }))
        if (fieldIsMissing || fieldIsEmpty) {
            return {
                missingField: field,
                ok: false,
            }
        }
    }

    return {
        ok: true,
        missingField: undefined,
    }
}
