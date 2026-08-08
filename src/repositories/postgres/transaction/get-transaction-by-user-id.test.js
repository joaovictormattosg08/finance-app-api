import { PostgresGetTransactionByUserId } from './get-transaction-by-user-id'
import { transactionParams, user } from '../../../test'
import { prisma } from '../../../../prisma/prisma'
import dayjs from 'dayjs'

describe('GetTransactionByUserIdRepository', () => {
    it('should get transaction by user id on db', async () => {
        const sut = new PostgresGetTransactionByUserId()
        await prisma.user.create({ data: user })
        const date = '2025-01-02'
        await prisma.transaction.create({
            data: {
                ...transactionParams,
                date: new Date(date),
                user_id: user.id,
            },
        })

        const from = '2025-01-01'
        const to = '2025-02-01'

        const result = await sut.execute(user.id, from, to)

        expect(result[0].name).toBe(transactionParams.name)
        expect(String(result[0].amount)).toBe(String(transactionParams.amount))
        expect(result[0].type).toBe(transactionParams.type)
        expect(result[0].id).toBe(transactionParams.id)
        expect(result[0].user_id).toBe(user.id)
        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(date).daysInMonth(),
        )
        expect(dayjs(result[0].date).month()).toBe(dayjs(date).month())
        expect(dayjs(result[0].date).year()).toBe(dayjs(date).year())
    })

    it('should call prisma with correct params', async () => {
        const sut = new PostgresGetTransactionByUserId()
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'findMany')

        const from = '2025-01-01'
        const to = '2025-02-01'

        await sut.execute(user.id, from, to)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
        })
    })

    it('should throw if prisma throws', async () => {
        const sut = new PostgresGetTransactionByUserId()
        import.meta.jest
            .spyOn(prisma.transaction, 'findMany')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow()
    })
})
