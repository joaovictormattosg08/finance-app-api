import { prisma } from '../../../../prisma/prisma.js'
import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresGetTransactionByUserId {
    async execute(userId) {
        return await prisma.transaction.findMany({
            where: {
                user_id: userId,
            },
        })
    }
}
