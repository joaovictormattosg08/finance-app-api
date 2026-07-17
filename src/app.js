import express, { request, response } from 'express'

import { usersRouter } from './routes/user.js'
import { transactionsRouter } from './routes/transactions.js'

export const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)

app.use('/api/transactions', transactionsRouter)
// 3000: Porta que será usada para acessar o projeto
