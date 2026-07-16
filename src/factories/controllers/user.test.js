import {
    CreateUserController,
    DeleteUserController,
    GetUserBalanceController,
    GetUserByIdController,
    UpdateUserController,
} from '../../controllers'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserBalanceController,
    makeGetUserByIdController,
    makeUpdateUserController,
} from './user'

describe('User Controller Factories', () => {
    it('should return a valid CreateUserController instace', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })
})
