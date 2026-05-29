'use client'

import { signInSchema, SignInInput } from '@/types/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { readErrorMessage } from '@/utils/http'
import { Eye, EyeOff } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export function LoginForm() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [googleLoading, setGoogleLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [showPassword, setShowPassword] = useState(false)

	const handleGoogleSignIn = async () => {
		setGoogleLoading(true)
		setError(null)

		try {
			await authClient.signIn.social({
				provider: 'google',
				callbackURL: '/dashboard',
			})
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Google sign-in failed')
			setGoogleLoading(false)
		}
	}

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
				redirect: 'follow',
			})

			if (!response.ok) {
				setError(await readErrorMessage(response, 'Invalid email or password'))
				setIsLoading(false)
				return
			}

			// Use window.location for full page reload to ensure cookies are picked up
			window.location.href = '/dashboard'
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'An error occurred during login',
			)
			setIsLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
			{error && (
				<div className='border-danger/30 bg-danger-foreground text-danger rounded border px-4 py-3'>
					{error}
				</div>
			)}

			<div>
				<label className='text-foreground block text-sm font-medium'>
					Email
				</label>
				<input
					{...register('email')}
					type='email'
					className='border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-muted-foreground mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none'
					placeholder='you@example.com'
				/>
				{errors.email && (
					<p className='text-danger mt-1 text-sm'>{errors.email.message}</p>
				)}
			</div>

			<div>
				<label className='text-foreground block text-sm font-medium'>
					Password
				</label>
				<div className='relative'>
					<input
						{...register('password')}
						type={showPassword ? 'text' : 'password'}
						className='border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-muted-foreground mt-1 block w-full rounded-md border px-3 py-2 pr-10 focus:outline-none'
						placeholder='Enter password'
					/>
					<button
						type='button'
						onClick={() => setShowPassword(!showPassword)}
						className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform'
						tabIndex={-1}
					>
						{showPassword ? (
							<EyeOff className='h-4 w-4' />
						) : (
							<Eye className='h-4 w-4' />
						)}
					</button>
				</div>
				{errors.password && (
					<p className='text-danger mt-1 text-sm'>{errors.password.message}</p>
				)}
			</div>

			<button
				type='submit'
				disabled={isLoading}
				className='bg-primary text-primary-foreground w-full rounded-md px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
			>
				{isLoading ? 'Signing in...' : 'Sign in'}
			</button>

			<div className='relative'>
				<div className='absolute inset-0 flex items-center'>
					<div className='border-border w-full border-t'></div>
				</div>
				<div className='relative flex justify-center text-sm'>
					<span className='bg-card text-muted-foreground px-2'>
						Or continue with
					</span>
				</div>
			</div>

			<button
				type='button'
				onClick={handleGoogleSignIn}
				disabled={googleLoading}
				className='border-border bg-card text-foreground hover:bg-secondary w-full rounded-md border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50'
			>
				<span className='flex items-center justify-center gap-2'>
					<svg className='h-4 w-4' viewBox='0 0 24 24'>
						<path
							fill='currentColor'
							d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
						/>
						<path
							fill='currentColor'
							d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
						/>
						<path
							fill='currentColor'
							d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
						/>
						<path
							fill='currentColor'
							d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
						/>
					</svg>
					{googleLoading ? 'Signing in...' : 'Google'}
				</span>
			</button>

			<p className='text-muted-foreground text-center text-sm'>
				Don&apos;t have an account?{' '}
				<a href='/auth/signup' className='text-foreground hover:underline'>
					Create one
				</a>
			</p>
		</form>
	)
}
