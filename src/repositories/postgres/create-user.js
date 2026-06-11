import { PostgresHelper } from '../../db/postgres/helper'

export class PostgresCreateUserRepository {
    async execute(createUserParams) {
        //create user in postgres
        const results = await PostgresHelper.query(
            'INSERT INTO users (ID, first_name,last_name,email,password) VALUES ($1, $2, $3, $4, $5)',
            [
                // Cada um desses valores represa um parametro de forma ordenada que sera inserida no banco representada
                //por $1 = ID, $2 = first_name, $3 = last_name etc...
                createUserParams.ID,
                createUserParams.first_name,
                createUserParams.last_name,
                createUserParams.email,
                createUserParams.password,
            ],
        )

        return results[0]
    }
}
