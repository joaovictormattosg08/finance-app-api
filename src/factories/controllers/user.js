import {
    PostgresGetUserByIdRepository,
    PostgresCreateUserRepository,
    PostgresGetUserByEmailRepository,
    PostgresDeleteUserRepository,
    PostgresUpdateUserRepository,
} from '../../repositories/postgres/index.js'

import {
    GetUserByIdController,
    CreateUserController,
    UpdateUserController,
    DeleteUserController,
} from '../../controllers/index.js'

import {
    GetUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
} from '../../use-cases/index.js'

export const makeGetUserByIdController = () => {
    const postgresGetUserByIdRepository = new PostgresGetUserByIdRepository()

    const getUserByIdUseCase = new GetUserByIdUseCase(
        postgresGetUserByIdRepository,
    )

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    return getUserByIdController
}

export const makeCreateUserController = () => {
    const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository()
    const postgresCreateUserRepository = new PostgresCreateUserRepository()

    const createUserUseCase = new CreateUserUseCase(
        postgresGetUserByEmailRepository,
        postgresCreateUserRepository,
    )

    const createUserController = new CreateUserController(createUserUseCase)

    return createUserController
}

export const makeUpdateUserController = () => {
    const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository()
    const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
    const postgresGetUserByIdRepository = new PostgresGetUserByIdRepository()

    const updateUserUseCase = new UpdateUserUseCase(
        postgresGetUserByEmailRepository,
        postgresUpdateUserRepository,
        postgresGetUserByIdRepository,
    )

    const updateUserController = new UpdateUserController(updateUserUseCase)

    return updateUserController
}

export const makeDeleteUserControler = () => {
    const postgresDeleteUserRepository = new PostgresDeleteUserRepository()

    const deleteUserUseCase = new DeleteUserUseCase(
        postgresDeleteUserRepository,
    )

    const deleteUserController = new DeleteUserController(deleteUserUseCase)

    return deleteUserController
}
