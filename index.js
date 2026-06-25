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
    makeCreateUserController,
    makeDeleteUserControler,
    makeGetUserByIdController,
    makeUpdateUserController,
} from './src/factories/controllers/user.js'
import {
    makeCreateTransactionController,
    makeGetTransactionByUserIdController,
} from './src/factories/controllers/transaction.js'

const app = express()

app.use(express.json())

app.post('/api/users', async (request, response) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).json(body)
})

app.get('/api/users/:userId', async (request, response) => {
    const getUserByIdController = makeGetUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute(request)

    response.status(statusCode).json(body)
})

app.patch('/api/users/:userId', async (request, response) => {
    const updateUserController = makeUpdateUserController()

    const { statusCode, body } = await updateUserController.execute(request)

    response.status(statusCode).json(body)
})
app.delete('/api/users/:userId', async (request, response) => {
    const deleteUserController = makeDeleteUserControler()

    const { statusCode, body } = await deleteUserController.execute(request)

    response.status(statusCode).json(body)
})

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
// 3000: Porta que será usada para acessar o projeto
app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
