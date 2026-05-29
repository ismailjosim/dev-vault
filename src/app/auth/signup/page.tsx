import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
			<div className='w-full max-w-md'>
				<div className='text-center'>
					<h1 className='text-3xl font-bold text-gray-900'>DevVault</h1>
					<h2 className='mt-2 text-xl font-semibold text-gray-900'>
						Create your account
					</h2>
					<p className='mt-2 text-sm text-gray-600'>
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
