import { BuiltInTemplate } from '@/utils/templates'
import Link from 'next/link'

export function TemplateCard({ template }: { template: BuiltInTemplate }) {
	return (
		<Link
			href={`/dashboard/templates/${template.id}`}
			className='block rounded-lg border border-border bg-card p-4 text-card-foreground transition hover:border-muted-foreground'
		>
			<div className='flex items-start justify-between gap-3'>
				<div>
					<h2 className='text-base font-semibold'>{template.name}</h2>
					<p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>
						{template.description}
					</p>
				</div>
				<span className='rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground'>
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
