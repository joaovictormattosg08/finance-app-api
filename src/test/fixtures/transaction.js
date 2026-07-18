import { faker } from '@faker-js/faker'

export const transactionParams = {
    id: faker.string.uuid(),
    name: faker.string.alphanumeric(10),
    user_id: faker.string.uuid(),
    date: faker.date.anytime().toISOString(),
    amount: Number(faker.finance.amount()),
    type: 'EARNING',
}
