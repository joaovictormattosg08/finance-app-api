import { user as fakeUser } from '../../../test'
import { prisma } from '../../../../prisma/prisma'
import { PostgresUpdateUserRepository } from './update-user'
import { faker } from '@faker-js/faker'

describe('UpdateUserRepository', () => {
    const updateUserParams = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    it('should update a user on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })

        const sut = new PostgresUpdateUserRepository()

        const result = await sut.execute(user.id, updateUserParams)

        expect(result).toStrictEqual(updateUserParams)
    })

    it('should call prisma with correct params', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const prismaSpy = jest.spyOn(prisma.user, 'update')
        const sut = new PostgresUpdateUserRepository()

        const result = await sut.execute(user.id, updateUserParams)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: fakeUser.id,
            },
            data: updateUserParams,
        })
    })
})
