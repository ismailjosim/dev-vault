import { BrandLogo } from '@/components/common/BrandLogo'
import { SignupForm } from '@/components/auth/SignupForm'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default function SignupPage() {
	return (
		<div className='bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
			<div className='absolute top-6 right-6'>
				<ThemeToggle />
			</div>
			<div className='w-full max-w-md'>
				<div className='text-center'>
					<BrandLogo />
					<h2 className='text-foreground mt-2 text-xl font-semibold'>
						Create your account
					</h2>
					<p className='text-muted-foreground mt-2 text-sm'>
						Securely manage your environment variables and secrets
					</p>
				</div>

				<div className='mt-8'>
					<SignupForm />
				</div>
			</div>
		</div>
	)
}
