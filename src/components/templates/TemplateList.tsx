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
			[template.name, template.description, ...template.variables.map((item) => item.key)]
				.join(' ')
				.toLowerCase()
				.includes(value),
		)
	}, [query, templates])

	return (
		<div>
			<div className='relative max-w-xl'>
				<Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
				<input
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder='Search templates'
					className='w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-foreground outline-none focus:border-muted-foreground'
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
