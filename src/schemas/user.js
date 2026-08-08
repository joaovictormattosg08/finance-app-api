import { z } from 'zod'

export const createUserSchema = z.object({
    first_name: z.string().trim().min(1, {
        message: 'First name is required',
    }),
    last_name: z.string().trim().min(1, {
        message: 'Last name is required',
    }),
    email: z
        .string({
            required_error: 'Email is required',
        })
        .email({
            message: 'please provide a valid e-mail',
        })
        .trim()
        .min(1, {
            message: 'e-mail is required',
        }),
    password: z
        .string({
            required_error: 'Password is required',
        })
        .trim()
        .min(6, {
            message: 'Password must have at least 6 characters',
        }),
})

export const updateUserSchema = createUserSchema.partial().strict({
    message: 'Some provided field is not allowed',
})

export const loginUserSchema = z.object({
    email: z.string().email().trim().min(1, {
        message: 'E-mail is required',
    }),

    password: z.string().trim().min(6, {
        message: 'Password must have at least 6 characters',
    }),
})

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, {
        message: 'Refresh token is required',
    }),
})

export const getUserBalanceSchema = z.object({
    user_id: z.string().uuid(),
    from: z.string().date(),
    to: z.string().date(),
})
