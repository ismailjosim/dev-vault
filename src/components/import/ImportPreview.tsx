import { ParsedEnvVariable } from '@/utils/env-parser'

export function ImportPreview({
	variables,
}: {
	variables: (ParsedEnvVariable & { type?: string })[]
}) {
	if (variables.length === 0) {
		return (
			<div className='border-border bg-card text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm'>
				No valid variables detected.
			</div>
		)
	}

	return (
		<div className='border-border bg-card overflow-x-auto rounded-lg border'>
			<table className='w-full min-w-[560px] text-left'>
				<thead>
					<tr className='text-muted-foreground text-xs uppercase'>
						<th className='px-3 py-3'>Key</th>
						<th className='px-3 py-3'>Value</th>
						<th className='px-3 py-3'>Detected type</th>
					</tr>
				</thead>
				<tbody>
					{variables.map((variable) => (
						<tr key={variable.key} className='border-border border-t'>
							<td className='text-foreground px-3 py-3 font-mono text-sm'>
								{variable.key}
							</td>
							<td className='text-muted-foreground max-w-[240px] truncate px-3 py-3 font-mono text-sm'>
								{variable.value || '(empty)'}
							</td>
							<td className='px-3 py-3'>
								<span className='bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs'>
									{variable.type || 'other'}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
