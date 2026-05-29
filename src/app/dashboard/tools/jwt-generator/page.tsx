import { JWTGenerator } from '@/components/tools/JWTGenerator'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { getCurrentUser } from '@/lib/session'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function JWTGeneratorPage() {
	const user = await getCurrentUser()
	if (!user?.id) redirect('/auth/login')

	return (
		<main className='min-h-screen bg-background px-6 py-8'>
			<div className='mx-auto max-w-6xl'>
				<div className='flex items-center justify-between'>
					<Link href='/dashboard' className='text-sm text-muted-foreground'>
						Back to dashboard
					</Link>
					<ThemeToggle />
				</div>
				<h1 className='mt-4 text-2xl font-semibold text-foreground'>
					JWT secret generator
				</h1>
				<p className='mt-1 text-sm text-muted-foreground'>
					Generate access and refresh token secrets with .env formatting.
				</p>
				<div className='mt-6'>
					<JWTGenerator />
				</div>
			</div>
		</main>
	)
}
