import { transactionParams, user } from '../../../test'
import { prisma } from '../../../../prisma/prisma'
import { PostgresDeleteTransactionRepository } from './delete-transaction'
import dayjs from 'dayjs'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { TransactionNotFoundError } from '../../../errors/transaction'

describe('DeleteTransactionRepository', () => {
    it('should delete a transaction on db', async () => {
        await prisma.user.create({ data: user })

        await prisma.transaction.create({
            data: { ...transactionParams, user_id: user.id },
        })

        const sut = new PostgresDeleteTransactionRepository()

        const result = await sut.execute(transactionParams.id)

        expect(result.name).toBe(transactionParams.name)
        expect(String(result.amount)).toBe(String(transactionParams.amount))
        expect(result.type).toBe(transactionParams.type)
        expect(result.id).toBe(transactionParams.id)
        expect(result.user_id).toBe(user.id)
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transactionParams.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(
            dayjs(transactionParams.date).month(),
        )
        expect(dayjs(result.date).year()).toBe(
            dayjs(transactionParams.date).year(),
        )
    })

    it('should call prisma with correct params', async () => {
        await prisma.user.create({ data: user })

        await prisma.transaction.create({
            data: { ...transactionParams, user_id: user.id },
        })
        const sut = new PostgresDeleteTransactionRepository()
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'delete')

        await sut.execute(transactionParams.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: transactionParams.id },
        })
    })

    it('should throw generic error if prisma throws generic error', async () => {
        const sut = new PostgresDeleteTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'delete')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transactionParams.id)

        await expect(promise).rejects.toThrow()
    })

    it('should throw generic error if prisma throws generic error', async () => {
        const sut = new PostgresDeleteTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'delete')
            .mockRejectedValueOnce(
                new PrismaClientKnownRequestError('', {
                    code: 'P2025',
                }),
            )

        const promise = sut.execute(transactionParams.id)

        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transactionParams.id),
        )
    })
})
