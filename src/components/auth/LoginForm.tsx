'use client'

import { signInSchema, SignInInput } from '@/types/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function LoginForm() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInInput>({
		resolver: zodResolver(signInSchema),
	})

	const onSubmit = async (data: SignInInput) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch('/api/auth/sign-in/email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: data.email,
					password: data.password,
				}),
			})

			if (!response.ok) {
				const error = await response.json()
				setError(error.message || 'Invalid email or password')
				return
			}

			router.push('/dashboard')
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'An error occurred during login',
			)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
			{error && (
				<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>
					{error}
				</div>
			)}

			<div>
				<label className='block text-sm font-medium text-gray-700'>Email</label>
				<input
					{...register('email')}
					type='email'
					className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
					placeholder='you@example.com'
				/>
				{errors.email && (
					<p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>
				)}
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Password
				</label>
				<input
					{...register('password')}
					type='password'
					className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
					placeholder='Enter password'
				/>
				{errors.password && (
					<p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>
				)}
			</div>

			<button
				type='submit'
				disabled={isLoading}
				className='w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
			>
				{isLoading ? 'Signing in...' : 'Sign in'}
			</button>

			<p className='text-center text-sm text-gray-600'>
				Don&apos;t have an account?{' '}
				<a href='/auth/signup' className='text-blue-600 hover:text-blue-700'>
					Create one
				</a>
			</p>
		</form>
	)
}
