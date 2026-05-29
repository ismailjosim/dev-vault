'use client'

import { signUpSchema, SignUpInput } from '@/types/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { readErrorMessage } from '@/utils/http'

export function SignupForm() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpInput>({
		resolver: zodResolver(signUpSchema),
	})

	const onSubmit = async (data: SignUpInput) => {
		if (data.password !== data.confirmPassword) {
			setError('Passwords do not match')
			return
		}

		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch('/api/auth/sign-up/email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: data.email,
					password: data.password,
					name: data.name,
				}),
			})

			if (!response.ok) {
				setError(
					await readErrorMessage(response, 'Signup failed. Please try again.'),
				)
				return
			}

			router.push('/dashboard')
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'An error occurred during signup',
			)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
			{error && (
				<div className='rounded border border-danger/30 bg-danger-foreground px-4 py-3 text-danger'>
					{error}
				</div>
			)}

			<div>
				<label className='block text-sm font-medium text-foreground'>
					Full Name
				</label>
				<input
					{...register('name')}
					type='text'
					className='mt-1 block w-full rounded-md border border-border bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-muted-foreground focus:outline-none'
					placeholder='John Doe'
				/>
				{errors.name && (
					<p className='mt-1 text-sm text-danger'>{errors.name.message}</p>
				)}
			</div>

			<div>
				<label className='block text-sm font-medium text-foreground'>Email</label>
				<input
					{...register('email')}
					type='email'
					className='mt-1 block w-full rounded-md border border-border bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-muted-foreground focus:outline-none'
					placeholder='you@example.com'
				/>
				{errors.email && (
					<p className='mt-1 text-sm text-danger'>{errors.email.message}</p>
				)}
			</div>

			<div>
				<label className='block text-sm font-medium text-foreground'>
					Password
				</label>
				<input
					{...register('password')}
					type='password'
					className='mt-1 block w-full rounded-md border border-border bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-muted-foreground focus:outline-none'
					placeholder='Enter password'
				/>
				{errors.password && (
					<p className='mt-1 text-sm text-danger'>{errors.password.message}</p>
				)}
			</div>

			<div>
				<label className='block text-sm font-medium text-foreground'>
					Confirm Password
				</label>
				<input
					{...register('confirmPassword')}
					type='password'
					className='mt-1 block w-full rounded-md border border-border bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-muted-foreground focus:outline-none'
					placeholder='Confirm password'
				/>
				{errors.confirmPassword && (
					<p className='mt-1 text-sm text-danger'>
						{errors.confirmPassword.message}
					</p>
				)}
			</div>

			<button
				type='submit'
				disabled={isLoading}
				className='w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
			>
				{isLoading ? 'Creating account...' : 'Sign up'}
			</button>

			<p className='text-center text-sm text-muted-foreground'>
				Already have an account?{' '}
				<a href='/auth/login' className='text-foreground hover:underline'>
					Sign in
				</a>
			</p>
		</form>
	)
}
