import { PostgresGetTransactionByUserId } from './get-transaction-by-user-id'
import { transactionParams, user } from '../../../test'
import { prisma } from '../../../../prisma/prisma'
import dayjs from 'dayjs'

describe('GetTransactionByUserIdRepository', () => {
    it('should get transaction by user id on db', async () => {
        const sut = new PostgresGetTransactionByUserId()
        await prisma.user.create({ data: user })

        await prisma.transaction.create({
            data: { ...transactionParams, user_id: user.id },
        })

        const result = await sut.execute(user.id)

        expect(result[0].name).toBe(transactionParams.name)
        expect(String(result[0].amount)).toBe(String(transactionParams.amount))
        expect(result[0].type).toBe(transactionParams.type)
        expect(result[0].id).toBe(transactionParams.id)
        expect(result[0].user_id).toBe(user.id)
        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(transactionParams.date).daysInMonth(),
        )
        expect(dayjs(result[0].date).month()).toBe(
            dayjs(transactionParams.date).month(),
        )
        expect(dayjs(result[0].date).year()).toBe(
            dayjs(transactionParams.date).year(),
        )
    })

    it('should call prisma with correct params', async () => {
        const sut = new PostgresGetTransactionByUserId()
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'findMany')

        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { user_id: user.id },
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
