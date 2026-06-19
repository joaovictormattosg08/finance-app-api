export class GetUserByIdUseCase {
    constructor(PostgresGetUserByIdRepository) {
        this.PostgresGetUserByIdRepository = PostgresGetUserByIdRepository
    }

    async execute(userId) {
        const user = await this.PostgresGetUserByIdRepository.execute(userId)

        return user
    }
}
