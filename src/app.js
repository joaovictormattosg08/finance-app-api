import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import express from 'express'
import swaggerUi from 'swagger-ui-express'

import { usersRouter } from './routes/user.js'
import { transactionsRouter } from './routes/transactions.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../docs/swagger.json'), 'utf-8'),
)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
