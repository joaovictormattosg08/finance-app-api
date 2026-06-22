import { CreateTransactionController } from '../../controllers/index.js'
import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
} from '../../repositories/postgres/index.js'
import {
    CreateTransactionUseCase,
    CreateUserUseCase,
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
