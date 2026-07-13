import {} from '../../repositories/postgres/user/get-user-by-email.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
    constructor(
        PostgresGetUserByEmailRepository,
        PostgresCreateUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
    ) {
        this.PostgresGetUserByEmailRepository = PostgresGetUserByEmailRepository
        this.PostgresCreateUserRepository = PostgresCreateUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
        this.idGeneratorAdapter = idGeneratorAdapter
    }

    async execute(createUserParams) {
        const userWithProvidedEmail =
            await this.PostgresGetUserByEmailRepository.execute(
                createUserParams.email,
            )

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        //gerar ID do usuário
        const userId = await this.idGeneratorAdapter.execute()

        //Criptografar a senha
        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password,
        )

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

        const createdUser =
            await this.PostgresCreateUserRepository.execute(user)

        return createdUser
    }
}
