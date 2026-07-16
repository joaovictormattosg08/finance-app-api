import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../../../../prisma/prisma.js'
import { TransactionNotFoundError } from '../../../errors/transaction.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionID) {
        try {
            return await prisma.transaction.delete({
                where: {
                    id: transactionID,
                },
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                const code = error.code

                if (code == 'P2025') {
                    throw new TransactionNotFoundError()
                }
            }

            throw error
        }
    }
}
