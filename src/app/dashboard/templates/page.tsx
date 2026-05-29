import { TemplateList } from '@/components/templates/TemplateList'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { getCurrentUser } from '@/lib/session'
import { getBuiltInTemplates } from '@/utils/templates'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function TemplatesPage() {
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
					Environment templates
				</h1>
				<p className='mt-1 text-sm text-muted-foreground'>
					Start projects faster with common environment variable sets.
				</p>
				<div className='mt-6'>
					<TemplateList templates={getBuiltInTemplates()} />
				</div>
			</div>
		</main>
	)
}
