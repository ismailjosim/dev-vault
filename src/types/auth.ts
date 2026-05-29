import { z } from 'zod'

export const signUpSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.max(100, 'Password must not exceed 100 characters'),
	confirmPassword: z.string(),
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(100, 'Name must not exceed 100 characters'),
})

export const signInSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
})

export const updatePasswordSchema = z.object({
	currentPassword: z.string().min(1, 'Current password is required'),
	newPassword: z.string().min(8, 'Password must be at least 8 characters'),
	confirmPassword: z.string(),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
