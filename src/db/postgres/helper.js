// Funciona como um client que se conecta no banco
import pg, { Query } from 'pg'
import 'dotenv/config'

const { Pool } = pg

console.log(process.env.POSTGRES_PASSWORD)

export const pool = new Pool({
    user: process.env.POSTGRES_USER, //Passamos o usuario que definimos ao criar o banco e agora no nosso .env
    password: process.env.POSTGRES_PASSWORD, //Senha para a conexão
    port: process.env.POSTGRES_PORT, //porta de acesso
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
})

export const PostgresHelper = {
    query: async (query, params) => {
        const client = await pool.connect()

        const results = await client.query(query, params)

        await client.release()

        return results.rows
    },
}
