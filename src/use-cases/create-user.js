import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uudi'
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user'

export class CreateUserUseCase {
    async execute(createUserParams) {
        //TODO:Verificar se o e-mail já está em uso
        //gerar ID do usuário
        const userId = uuidv4()

        //Criptografar a senha
        const hashedPasswrod = await bcrypt.hash(createUserParams.password, 10)

        //Inserir o usuário no banco
        const user = {
            //Pode substituir todos os createUserParams por (...createUserParams)
            id: userId,
            password: hashedPasswrod,
            first_name: createUserParams.first_name,
            last_name: createUserParams.last_name,
            email: createUserParams.email,
        }

        // Chamar o repository
        const PostgresCreateUserRepository = new PostgresCreateUserRepository()

        const createdUser = await PostgresCreateUserRepository.execute(user)

        return createdUser
    }
}
