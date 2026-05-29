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
			className='block rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-zinc-400'
		>
			<div className='flex items-start justify-between gap-3'>
				<div>
					<h2 className='text-base font-semibold text-zinc-950'>
						{project.projectName}
					</h2>
					<p className='mt-1 line-clamp-2 text-sm text-zinc-600'>
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
				<span className='rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700'>
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

			<p className='mt-4 text-xs text-zinc-500'>
				Created {new Date(project.createdAt).toLocaleDateString()}
			</p>
		</Link>
	)
}
