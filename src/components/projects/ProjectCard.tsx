import Link from 'next/link'

export type ProjectSummary = {
	_id: string
	projectName: string
	description: string
	category: string
	framework: string
	tags: string[]
	isPinned: boolean
	environments?: string[]
	createdAt: string
}

export function ProjectCard({ project }: { project: ProjectSummary }) {
	return (
		<Link
			href={`/dashboard/projects/${project._id}`}
			className='border-border bg-card text-card-foreground hover:border-muted-foreground block rounded-lg border p-4 transition'
		>
			<div className='flex items-start justify-between gap-3'>
				<div>
					<h2 className='text-card-foreground text-base font-semibold'>
						{project.projectName}
					</h2>
					<p className='text-muted-foreground mt-1 line-clamp-2 text-sm'>
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
				<span className='bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs'>
					{project.category}
				</span>
				<span className='rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-800'>
					{project.framework}
				</span>
				{project.tags.map((tag) => (
					<span
						key={tag}
						className='rounded bg-sky-100 px-2 py-1 text-xs text-sky-800'
					>
						{tag}
					</span>
				))}
			</div>

			<p className='text-muted-foreground mt-4 text-xs'>
				Created {new Date(project.createdAt).toLocaleDateString()}
			</p>
		</Link>
	)
}
