import { SnippetCard, SnippetSummary } from '@/components/snippets/SnippetCard'

export function SnippetList({ snippets }: { snippets: SnippetSummary[] }) {
	if (snippets.length === 0) {
		return (
			<div className='border-border bg-card rounded-lg border border-dashed p-8 text-center'>
				<h2 className='text-card-foreground text-base font-semibold'>
					No snippets
				</h2>
				<p className='text-muted-foreground mt-2 text-sm'>
					Create a snippet or clear filters to see built-in examples.
				</p>
			</div>
		)
	}

	return (
		<div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
			{snippets.map((snippet) => (
				<SnippetCard key={snippet._id} snippet={snippet} />
			))}
		</div>
	)
}
