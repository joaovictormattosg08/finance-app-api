import z from 'zod'
import validator from 'validator'

export const createTransactionSchema = z.object({
    user_id: z.string().uuid({
        message: 'User ID must be a valid UUID',
    }),
    name: z.string().trim().min(1, {
        message: 'name is required',
    }),
    date: z.coerce.date(),
    type: z.enum(['EXPENSE', 'EARNING', 'INVESTMENT'], {
        errorMap: () => ({
            message: 'Type must be EXPENSE, EARNING OR INVESTMENT',
        }),
    }),
    amount: z
        .number({
            message: 'amount must be a number',
        })
        .min(1, {
            message: 'Amount must be greater than 0',
        })
        .refine((value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: '.',
            }),
        ),
})

export const updateTransactionSchema = createTransactionSchema
    .omit({
        user_id: true,
    })
    .partial()
    .strict({
        message: 'Some provided field is not allowed',
    })
