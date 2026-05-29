import Link from 'next/link'

export type TagSummary = {
	tag: string
	count: number
}

export function TagCloud({ tags }: { tags: TagSummary[] }) {
	if (tags.length === 0) {
		return (
			<div className='border-border bg-card text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm'>
				No project tags yet.
			</div>
		)
	}

	return (
		<div className='flex flex-wrap gap-3'>
			{tags.map((item) => (
				<Link
					key={item.tag}
					href={`/dashboard?tag=${encodeURIComponent(item.tag)}`}
					className='border-border bg-card text-card-foreground hover:border-muted-foreground rounded-lg border px-4 py-3 transition'
				>
					<span className='text-sm font-semibold'>#{item.tag}</span>
					<span className='text-muted-foreground ml-2 text-xs'>
						{item.count}
					</span>
				</Link>
			))}
		</div>
	)
}
