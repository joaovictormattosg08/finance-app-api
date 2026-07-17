import 'dotenv/config.js'
import express, { request, response } from 'express'
import {
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    UpdateUserController,
    CreateTransactionController,
} from './src/controllers/index.js'

import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionByUserIdController,
    makeUpdateTransactionController,
} from './src/factories/controllers/transaction.js'
import { usersRouter } from './src/routes/user.js'

const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)

app.get('/api/transactions', async (request, response) => {
    const getTransactionByUserIdController =
        makeGetTransactionByUserIdController()

    const { statusCode, body } =
        await getTransactionByUserIdController.execute(request)

    response.status(statusCode).json(body)
})

app.post('/api/transactions', async (request, response) => {
    const createTransactionController = makeCreateTransactionController()

    const { statusCode, body } =
        await createTransactionController.execute(request)

    response.status(statusCode).json(body)
})

app.patch('/api/transactions/:transactionId', async (request, response) => {
    const updateTransactionController = makeUpdateTransactionController()

    const { statusCode, body } =
        await updateTransactionController.execute(request)

    response.status(statusCode).json(body)
})

app.delete('/api/transactions/:transactionId', async (request, response) => {
    const DeleteTransactionController = makeDeleteTransactionController()

    const { statusCode, body } =
        await DeleteTransactionController.execute(request)

    response.status(statusCode).json(body)
})
// 3000: Porta que será usada para acessar o projeto
app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
