'use client'

import { TemplateCard } from '@/components/templates/TemplateCard'
import { BuiltInTemplate } from '@/utils/templates'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

export function TemplateList({ templates }: { templates: BuiltInTemplate[] }) {
	const [query, setQuery] = useState('')
	const filteredTemplates = useMemo(() => {
		const value = query.trim().toLowerCase()
		if (!value) return templates

		return templates.filter((template) =>
			[
				template.name,
				template.description,
				...template.variables.map((item) => item.key),
			]
				.join(' ')
				.toLowerCase()
				.includes(value),
		)
	}, [query, templates])

	return (
		<div>
			<div className='relative max-w-xl'>
				<Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
				<input
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder='Search templates'
					className='border-border bg-card text-foreground focus:border-muted-foreground w-full rounded-md border py-2 pr-3 pl-9 outline-none'
				/>
			</div>

			<div className='mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
				{filteredTemplates.map((template) => (
					<TemplateCard key={template.id} template={template} />
				))}
			</div>
		</div>
	)
}
