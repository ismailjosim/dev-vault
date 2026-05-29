'use client'

import { Clipboard, Download } from 'lucide-react'

export function GenerateExample({ content }: { content: string }) {
	function download() {
		const blob = new Blob([content], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const anchor = document.createElement('a')
		anchor.href = url
		anchor.download = '.env.example'
		anchor.click()
		URL.revokeObjectURL(url)
	}

	async function copy() {
		await navigator.clipboard.writeText(content)
	}

	return (
		<section className='border-border bg-card rounded-lg border p-5'>
			<div className='flex items-center justify-between gap-3'>
				<h2 className='text-card-foreground text-base font-semibold'>
					.env.example
				</h2>
				<div className='flex gap-2'>
					<button
						type='button'
						onClick={copy}
						className='border-border text-foreground hover:bg-hover inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm'
					>
						<Clipboard className='h-4 w-4' />
						Copy
					</button>
					<button
						type='button'
						onClick={download}
						className='bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:opacity-90'
					>
						<Download className='h-4 w-4' />
						Download
					</button>
				</div>
			</div>
			<pre className='border-border bg-background text-foreground mt-4 overflow-auto rounded-md border p-4 text-sm'>
				{content}
			</pre>
		</section>
	)
}
