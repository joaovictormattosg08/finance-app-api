import { badRequest, notFound } from './http.js'
import validator from 'validator'

export const userNotFoundResponse = () => {
    return notFound({ message: 'User not found' })
}
