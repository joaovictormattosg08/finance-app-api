import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionID) {
        const transaction = await PostgresHelper.query(
            'DELETE FROM transactions WHERE id = $1 RETURNING *',
            [transactionID],
        )
        return transaction[0]
    }
}
