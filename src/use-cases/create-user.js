import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class CreateUserUseCase {
    async execute(createUserParams) {
        //TODO:Verificar se o e-mail já está em uso
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()

        const userWithProvidedEmail =
            await postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            )

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        //gerar ID do usuário
        const userId = uuidv4()

        //Criptografar a senha
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

        //Inserir o usuário no banco
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
            // first_name: createUserParams.first_name,
            // last_name: createUserParams.last_name,
            // email: createUserParams.email,
        }

        // Chamar o repository
        const postgresCreateUserRepository = new PostgresCreateUserRepository()

        const createdUser = await postgresCreateUserRepository.execute(user)

        return createdUser
    }
}
