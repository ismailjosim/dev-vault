import {
	EnvVariableItem,
	EnvVariableSummary,
} from '@/components/env/EnvVariableItem'

export function EnvVariableTable({
	projectId,
	variables,
}: {
	projectId: string
	variables: EnvVariableSummary[]
}) {
	if (variables.length === 0) {
		return (
			<div className='rounded-lg border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground'>
				No environment variables yet.
			</div>
		)
	}

	return (
		<div className='overflow-x-auto rounded-lg border border-border bg-card'>
			<table className='w-full min-w-[760px] text-left'>
				<thead>
					<tr className='text-xs uppercase text-muted-foreground'>
						<th className='px-3 py-3'>Key</th>
						<th className='px-3 py-3'>Value</th>
						<th className='px-3 py-3'>Type</th>
						<th className='px-3 py-3'>Environment</th>
						<th className='px-3 py-3'>Note</th>
						<th className='px-3 py-3 text-right'>Actions</th>
					</tr>
				</thead>
				<tbody>
					{variables.map((variable) => (
						<EnvVariableItem
							key={variable._id}
							projectId={projectId}
							variable={variable}
						/>
					))}
				</tbody>
			</table>
		</div>
	)
}
