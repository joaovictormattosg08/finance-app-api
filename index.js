import 'dotenv/config.js'
import express, { request, response } from 'express'
import {
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    UpdateUserController,
    CreateTransactionController,
} from './src/controllers/index.js'

import { usersRouter } from './src/routes/user.js'
import { transactionsRouter } from './src/routes/transactions.js'

export const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)

app.use('/api/transactions', transactionsRouter)
// 3000: Porta que será usada para acessar o projeto
app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
