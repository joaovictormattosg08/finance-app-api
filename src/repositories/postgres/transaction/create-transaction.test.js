import { PostgresCreateTransactionRepository } from './create-transaction'
import { transactionParams, user } from '../../../test'
import { prisma } from '../../../../prisma/prisma'
import { Result } from 'pg'
import dayjs from 'dayjs'

describe('CreateTransactionRepository', () => {
    it('should create a transaction on db', async () => {
        await prisma.user.create({ data: user })

        const sut = new PostgresCreateTransactionRepository()

        const result = await sut.execute({
            ...transactionParams,
            user_id: user.id,
        })

        expect(result.name).toBe(transactionParams.name)
        expect(String(result.amount)).toBe(String(transactionParams.amount))
        expect(result.type).toBe(transactionParams.type)
        expect(result.id).toBe(transactionParams.id)
        expect(result.user_id).toBe(user.id)
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transactionParams.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(dayjs(transactionParams.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(transactionParams.date).year())
    })

    it('should call prisma with correct params', async () => {
        await prisma.user.create({ data: user })
        const sut = new PostgresCreateTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'create')

        await sut.execute({ ...transactionParams, user_id: user.id })

        expect(prismaSpy).toHaveBeenCalledWith({
            data: {
                ...transactionParams,
                user_id: user.id,
            },
        })
    })

    it('should throw if prisma throws', async () => {
        const sut = new PostgresCreateTransactionRepository()
        jest.spyOn(prisma.transaction, 'create').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(transactionParams)

        await expect(promise).rejects.toThrow()
    })
})
