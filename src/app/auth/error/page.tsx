import { BrandLogo } from '@/components/common/BrandLogo'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default function AuthErrorPage({
	searchParams,
}: {
	searchParams: { error?: string }
}) {
	const errorMessage = searchParams.error || 'An authentication error occurred'

	return (
		<div className='bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
			<div className='absolute top-6 right-6'>
				<ThemeToggle />
			</div>
			<div className='w-full max-w-md'>
				<div className='text-center'>
					<BrandLogo href='/auth/login' />
					<h2 className='text-danger mt-2 text-xl font-semibold'>
						Authentication Error
					</h2>
					<p className='text-muted-foreground mt-4 text-sm'>{errorMessage}</p>
				</div>

				<div className='mt-8'>
					<a
						href='/auth/login'
						className='bg-primary text-primary-foreground block w-full rounded-md px-4 py-2 text-center text-sm font-semibold hover:opacity-90'
					>
						Back to Login
					</a>
				</div>
			</div>
		</div>
	)
}
