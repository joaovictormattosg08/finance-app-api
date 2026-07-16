import { TransactionType } from '@prisma/client'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../test/index.js'
import { PostgresGetUserBalanceRepository } from './get-user-balance.js'
import { faker } from '@faker-js/faker'

describe('GetUserBalanceRepository', () => {
    it('should get user balance on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })

        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.string.sample(),
                    amount: 5000,
                    type: 'EARNING',
                    user_id: user.id,
                    date: faker.date.recent(),
                },
                {
                    name: faker.string.sample(),
                    amount: 5000,
                    type: 'EARNING',
                    user_id: user.id,
                    date: faker.date.recent(),
                },
                {
                    name: faker.string.sample(),
                    amount: 1000,
                    type: 'EXPENSE',
                    user_id: user.id,
                    date: faker.date.recent(),
                },
                {
                    name: faker.string.sample(),
                    amount: 1000,
                    type: 'EXPENSE',
                    user_id: user.id,
                    date: faker.date.recent(),
                },
                {
                    name: faker.string.sample(),
                    amount: 3000,
                    type: 'INVESTMENT',
                    user_id: user.id,
                    date: faker.date.recent(),
                },
                {
                    name: faker.string.sample(),
                    amount: 3000,
                    type: 'INVESTMENT',
                    user_id: user.id,
                    date: faker.date.recent(),
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()

        const result = await sut.execute(user.id)

        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('6000')
        expect(result.balance.toString()).toBe('2000')
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate')

        await sut.execute(fakeUser.id)

        expect(prismaSpy).toHaveBeenCalledTimes(3)
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EARNING,
            },
            _sum: {
                amount: true,
            },
        })
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EXPENSE,
            },
            _sum: {
                amount: true,
            },
        })
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.INVESTMENT,
            },
            _sum: {
                amount: true,
            },
        })
    })
})
