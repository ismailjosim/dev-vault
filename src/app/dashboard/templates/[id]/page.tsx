import { UseTemplateModal } from '@/components/templates/UseTemplateModal'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { serializeDocument } from '@/lib/api'
import { connectDB } from '@/lib/mongodb'
import { getCurrentUser } from '@/lib/session'
import { Project } from '@/models/Project'
import { ProjectSummary } from '@/components/projects/ProjectCard'
import { getBuiltInTemplate } from '@/utils/templates'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

type TemplatePageProps = {
	params: Promise<{ id: string }>
}

export default async function TemplatePage({ params }: TemplatePageProps) {
	const user = await getCurrentUser()
	if (!user?.id) redirect('/auth/login')

	const { id } = await params
	const template = getBuiltInTemplate(id)
	if (!template) notFound()

	await connectDB()
	const projects = await Project.find({ userId: user.id }).sort({
		isPinned: -1,
		createdAt: -1,
	})

	return (
		<main className='min-h-screen bg-background px-6 py-8'>
			<div className='mx-auto max-w-6xl'>
				<div className='flex items-center justify-between'>
					<Link href='/dashboard/templates' className='text-sm text-muted-foreground'>
						Back to templates
					</Link>
					<ThemeToggle />
				</div>

				<div className='mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
					<div>
						<h1 className='text-2xl font-semibold text-foreground'>
							{template.name}
						</h1>
						<p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
							{template.description}
						</p>
					</div>
					{projects.length > 0 ? (
						<UseTemplateModal
							template={template}
							projects={serializeDocument<ProjectSummary[]>(projects)}
						/>
					) : (
						<Link
							href='/dashboard/projects/create'
							className='rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90'
						>
							Create project
						</Link>
					)}
				</div>

				<div className='mt-6 overflow-hidden rounded-lg border border-border bg-card'>
					<table className='w-full min-w-[640px] text-left'>
						<thead>
							<tr className='text-xs uppercase text-muted-foreground'>
								<th className='px-3 py-3'>Key</th>
								<th className='px-3 py-3'>Type</th>
								<th className='px-3 py-3'>Placeholder</th>
							</tr>
						</thead>
						<tbody>
							{template.variables.map((variable) => (
								<tr key={variable.key} className='border-t border-border'>
									<td className='px-3 py-3 font-mono text-sm text-foreground'>
										{variable.key}
									</td>
									<td className='px-3 py-3'>
										<span className='rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground'>
											{variable.type}
										</span>
									</td>
									<td className='px-3 py-3 text-sm text-muted-foreground'>
										{variable.placeholder || 'Empty value'}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	)
}
