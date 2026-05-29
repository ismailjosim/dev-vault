export default function AuthErrorPage({
	searchParams,
}: {
	searchParams: { error?: string }
}) {
	const errorMessage = searchParams.error || 'An authentication error occurred'

	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
			<div className='w-full max-w-md'>
				<div className='text-center'>
					<h1 className='text-3xl font-bold text-gray-900'>DevVault</h1>
					<h2 className='mt-2 text-xl font-semibold text-red-600'>
						Authentication Error
					</h2>
					<p className='mt-4 text-sm text-gray-600'>{errorMessage}</p>
				</div>

				<div className='mt-8'>
					<a
						href='/auth/login'
						className='block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700'
					>
						Back to Login
					</a>
				</div>
			</div>
		</div>
	)
}
