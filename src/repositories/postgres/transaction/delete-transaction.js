import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionID) {
        const deletedTransaction = await PostgresHelper.query(
            'DELETE FROM transactions WHERE id = $1',
            [transactionID],
        )
    }
}
