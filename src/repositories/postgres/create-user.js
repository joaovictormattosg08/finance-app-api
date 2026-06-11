import { PostgresHelper } from '../../db/postgres/helper.js'

export class PostgresCreateUserRepository {
    async execute(createUserParams) {
        //create user in postgres
        await PostgresHelper.query(
            'INSERT INTO users (id, first_name,last_name,email,password) VALUES ($1, $2, $3, $4, $5)',
            [
                // Cada um desses valores represa um parametro de forma ordenada que sera inserida no banco representada
                //por $1 = ID, $2 = first_name, $3 = last_name etc...
                createUserParams.id,
                createUserParams.first_name,
                createUserParams.last_name,
                createUserParams.email,
                createUserParams.password,
            ],
        )
        const createdUser = await PostgresHelper.query(
            'SELECT * FROM users WHERE id = $1',
            [createUserParams.id],
        )

        return createdUser[0]
    }
}
