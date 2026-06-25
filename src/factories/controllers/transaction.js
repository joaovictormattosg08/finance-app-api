import { CreateTransactionController } from '../../controllers/index.js'
import { GetTransactionByUserIdController } from '../../controllers/transaction/get-transaction-by-user-id.js'
import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
    PostgresGetTransactionByUserId,
} from '../../repositories/postgres/index.js'
import {
    CreateTransactionUseCase,
    CreateUserUseCase,
    GetTransactionByUserIdUseCase,
} from '../../use-cases/index.js'

export const makeCreateTransactionController = () => {
    const postgresCreateTransactionRepository =
        new PostgresCreateTransactionRepository()

    const postgresGetUserById = new PostgresGetUserByIdRepository()

    const createTransactionUseCase = new CreateTransactionUseCase(
        postgresCreateTransactionRepository,
        postgresGetUserById,
    )

    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )

    return createTransactionController
}

export const makeGetTransactionByUserIdController = () => {
    const postgresGetTransactionByUserId = new PostgresGetTransactionByUserId()
    const postgresGetUserById = new PostgresGetUserByIdRepository()

    const getTransactionByUserIdUseCase = new GetTransactionByUserIdUseCase(
        postgresGetTransactionByUserId,
        postgresGetUserById,
    )

    const getTransactionByUserIdController =
        new GetTransactionByUserIdController(getTransactionByUserIdUseCase)

    return getTransactionByUserIdController
}
