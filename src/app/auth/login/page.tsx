import { LoginForm } from '@/components/auth/LoginForm'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default function LoginPage() {
	return (
		<div className='flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
			<div className='absolute right-6 top-6'>
				<ThemeToggle />
			</div>
			<div className='w-full max-w-md'>
				<div className='text-center'>
					<h1 className='text-3xl font-bold text-foreground'>DevVault</h1>
					<h2 className='mt-2 text-xl font-semibold text-foreground'>
						Welcome back
					</h2>
					<p className='mt-2 text-sm text-muted-foreground'>
						Sign in to access your environment variables
					</p>
				</div>

				<div className='mt-8'>
					<LoginForm />
				</div>
			</div>
		</div>
	)
}
