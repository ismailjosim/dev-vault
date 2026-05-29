'use client'

export function ExportMenu({ projectId }: { projectId: string }) {
	async function exportProject(format: string) {
		const response = await fetch(`/api/projects/${projectId}/export`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ format }),
		})
		const payload = (await response.json()) as {
			filename: string
			content: string
		}
		const blob = new Blob([payload.content], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const anchor = document.createElement('a')
		anchor.href = url
		anchor.download = payload.filename
		anchor.click()
		URL.revokeObjectURL(url)
	}

	return (
		<div className='flex flex-wrap gap-2'>
			{['env', 'env.local', 'env.production', 'json', 'example'].map((format) => (
				<button
					key={format}
					type='button'
					onClick={() => exportProject(format)}
					className='rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800'
				>
					Export {format}
				</button>
			))}
		</div>
	)
}
