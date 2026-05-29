import { ProjectForm } from '@/components/projects/ProjectForm'
import { getCurrentUser } from '@/lib/session'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function CreateProjectPage() {
	const user = await getCurrentUser()
	if (!user?.id) redirect('/auth/login')

	return (
		<main className='min-h-screen bg-zinc-50 px-6 py-8'>
			<div className='mx-auto max-w-6xl'>
				<Link href='/dashboard' className='text-sm text-zinc-600'>
					Back to dashboard
				</Link>
				<h1 className='mt-4 text-2xl font-semibold text-zinc-950'>
					Create project
				</h1>
				<div className='mt-6 rounded-lg border border-zinc-200 bg-white p-6'>
					<ProjectForm />
				</div>
			</div>
		</main>
	)
}
