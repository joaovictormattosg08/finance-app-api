import { user as fakeUser } from '../../../test'
import { PostgresGetUserByIdRepository } from './get-user-by-id'
import { prisma } from '../../../../prisma/prisma'

describe('GetUserByIdRepository', () => {
    it('should get a user by id on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresGetUserByIdRepository()

        const result = await sut.execute(user.id)

        expect(result).toStrictEqual(user)
    })
})
