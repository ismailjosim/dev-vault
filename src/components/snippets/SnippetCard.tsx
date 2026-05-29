import Link from 'next/link'

export type SnippetSummary = {
	_id: string
	title: string
	category: string
	language: string
	description: string
	requiredEnv: string[]
	tags: string[]
	isBuiltIn?: boolean
	createdAt?: string | null
}

export function SnippetCard({ snippet }: { snippet: SnippetSummary }) {
	return (
		<Link
			href={`/dashboard/snippets/${snippet._id}`}
			className='border-border bg-card text-card-foreground hover:border-muted-foreground block rounded-lg border p-4 transition'
		>
			<div className='flex items-start justify-between gap-3'>
				<div>
					<h2 className='text-base font-semibold'>{snippet.title}</h2>
					<p className='text-muted-foreground mt-1 line-clamp-2 text-sm'>
						{snippet.description || 'No description'}
					</p>
				</div>
				{snippet.isBuiltIn && (
					<span className='bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs'>
						Built-in
					</span>
				)}
			</div>

			<div className='mt-4 flex flex-wrap gap-2'>
				<span className='rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-800'>
					{snippet.category}
				</span>
				<span className='rounded bg-sky-100 px-2 py-1 text-xs text-sky-800'>
					{snippet.language}
				</span>
				{snippet.tags.slice(0, 3).map((tag) => (
					<span
						key={tag}
						className='bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs'
					>
						{tag}
					</span>
				))}
			</div>

			{snippet.requiredEnv.length > 0 && (
				<p className='text-muted-foreground mt-4 truncate font-mono text-xs'>
					{snippet.requiredEnv.join(', ')}
				</p>
			)}
		</Link>
	)
}
