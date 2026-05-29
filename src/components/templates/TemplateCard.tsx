import { BuiltInTemplate } from '@/utils/templates'
import Link from 'next/link'

export function TemplateCard({ template }: { template: BuiltInTemplate }) {
	return (
		<Link
			href={`/dashboard/templates/${template.id}`}
			className='border-border bg-card text-card-foreground hover:border-muted-foreground block rounded-lg border p-4 transition'
		>
			<div className='flex items-start justify-between gap-3'>
				<div>
					<h2 className='text-base font-semibold'>{template.name}</h2>
					<p className='text-muted-foreground mt-1 line-clamp-2 text-sm'>
						{template.description}
					</p>
				</div>
				<span className='bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs'>
					{template.variables.length} vars
				</span>
			</div>
			<div className='mt-4 flex flex-wrap gap-2'>
				{template.variables.slice(0, 4).map((variable) => (
					<span
						key={variable.key}
						className='rounded bg-sky-100 px-2 py-1 font-mono text-xs text-sky-800'
					>
						{variable.key}
					</span>
				))}
			</div>
		</Link>
	)
}
