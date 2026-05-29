import { ProjectForm } from '@/components/projects/ProjectForm'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { getCurrentUser } from '@/lib/session'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function CreateProjectPage() {
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
					Create project
				</h1>
				<div className='mt-6 rounded-lg border border-border bg-card p-6'>
					<ProjectForm />
				</div>
			</div>
		</main>
	)
}
