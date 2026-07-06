import { prisma } from '../../../../prisma/prisma.js'
import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresCreateTransactionRepository {
    async execute(createTransactionParams) {
        return await prisma.transaction.create({
            data: createTransactionParams,
        })
    }
}
