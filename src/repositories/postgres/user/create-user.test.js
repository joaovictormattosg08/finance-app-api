import { PostgresCreateUserRepository } from './create-user'
import { faker } from '@faker-js/faker'
import { user } from '../../../test'

describe('CreateUserRepository', () => {
    it('should create a user on db', async () => {
        const sut = new PostgresCreateUserRepository()

        const result = sut.execute(user)

        expect(result).not.toBeNull()
    })
})
