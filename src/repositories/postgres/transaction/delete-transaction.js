import { prisma } from '../../../../prisma/prisma.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionID) {
        try {
            return await prisma.transaction.delete({
                where: {
                    id: transactionID,
                },
            })
        } catch (error) {
            return null
        }
    }
}
