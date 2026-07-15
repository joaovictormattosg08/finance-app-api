import { PostgresDeleteUserRepository } from './delete-user.js'
import { faker } from '@faker-js/faker'
import { user } from '../../../test'
import { prisma } from '../../../../prisma/prisma.js'
describe('DeleteUser', () => {
    it('should delete a user on db', async () => {
        await prisma.user.create({
            data: user,
        })
        const sut = new PostgresDeleteUserRepository()

        const result = await sut.execute(user.id)

        expect(result).toStrictEqual(user)
    })
})
