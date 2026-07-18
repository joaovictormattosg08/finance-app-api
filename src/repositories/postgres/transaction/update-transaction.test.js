import { prisma } from '../../../../prisma/prisma'
import { transactionParams, user } from '../../../test'
import { PostgresUpdateTransactionRepository } from './update-transaction'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'

const params = {
    id: faker.string.uuid(),
    name: faker.string.alphanumeric(10),
    user_id: user.id,
    date: faker.date.anytime().toISOString(),
    amount: Number(faker.finance.amount()),
    type: 'EARNING',
}
describe('UpdateTransactionRepository', () => {
    it('should update a transaction on db', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transactionParams, user_id: user.id },
        })
        const sut = new PostgresUpdateTransactionRepository()

        const result = await sut.execute(transactionParams.id, params)

        expect(result.name).toBe(params.name)
        expect(String(result.amount)).toBe(String(params.amount))
        expect(result.type).toBe(params.type)
        expect(result.id).toBe(params.id)
        expect(result.user_id).toBe(user.id)
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(params.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(dayjs(params.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(params.date).year())
    })

    it('should call prisma with correct params', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transactionParams, user_id: user.id },
        })
        const sut = new PostgresUpdateTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'update')

        await sut.execute(transactionParams.id, {
            ...transactionParams,
            user_id: user.id,
        })

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transactionParams.id,
            },
            data: { ...transactionParams, user_id: user.id },
        })
    })

    it('should throw if prisma throws', async () => {
        const sut = new PostgresUpdateTransactionRepository()
        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow()
    })
})
