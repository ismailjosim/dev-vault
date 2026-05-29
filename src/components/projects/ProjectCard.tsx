import Link from 'next/link'

export type ProjectSummary = {
	_id: string
	projectName: string
	description: string
	category: string
	framework: string
	tags: string[]
	isPinned: boolean
	createdAt: string
}

export function ProjectCard({ project }: { project: ProjectSummary }) {
	return (
		<Link
			href={`/dashboard/projects/${project._id}`}
			className='block rounded-lg border border-border bg-card p-4 text-card-foreground transition hover:border-muted-foreground'
		>
			<div className='flex items-start justify-between gap-3'>
				<div>
					<h2 className='text-base font-semibold text-card-foreground'>
						{project.projectName}
					</h2>
					<p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>
						{project.description || 'No description yet'}
					</p>
				</div>
				{project.isPinned && (
					<span className='rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800'>
						Pinned
					</span>
				)}
			</div>

			<div className='mt-4 flex flex-wrap gap-2'>
				<span className='rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground'>
					{project.category}
				</span>
				<span className='rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-800'>
					{project.framework}
				</span>
				{project.tags.map((tag) => (
					<span key={tag} className='rounded bg-sky-100 px-2 py-1 text-xs text-sky-800'>
						{tag}
					</span>
				))}
			</div>

			<p className='mt-4 text-xs text-muted-foreground'>
				Created {new Date(project.createdAt).toLocaleDateString()}
			</p>
		</Link>
	)
}
