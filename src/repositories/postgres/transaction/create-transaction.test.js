import { PostgresCreateTransactionRepository } from './create-transaction'
import { transaction, user as FakeUser } from '../../../test'
import { prisma } from '../../../../prisma/prisma'
import { Result } from 'pg'
import dayjs from 'dayjs'

describe('CreateTransactionRepository', () => {
    it('should create a transaction on db', async () => {
        const user = await prisma.user.create({ data: FakeUser })

        const sut = new PostgresCreateTransactionRepository()

        const result = await sut.execute({
            ...transaction,
            user_id: user.id,
        })

        expect(result.name).toBe(transaction.name)
        expect(String(result.amount)).toBe(String(transaction.amount))
        expect(result.type).toBe(transaction.type)
        expect(result.id).toBe(transaction.id)
        expect(result.user_id).toBe(user.id)
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year())
    })
})
