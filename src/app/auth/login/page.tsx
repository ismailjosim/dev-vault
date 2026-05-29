import { BrandLogo } from '@/components/common/BrandLogo'
import { LoginForm } from '@/components/auth/LoginForm'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default function LoginPage() {
	return (
		<div className='bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
			<div className='absolute top-6 right-6'>
				<ThemeToggle />
			</div>
			<div className='w-full max-w-md'>
				<div className='text-center'>
					<BrandLogo />
					<h2 className='text-foreground mt-2 text-xl font-semibold'>
						Welcome back
					</h2>
					<p className='text-muted-foreground mt-2 text-sm'>
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
