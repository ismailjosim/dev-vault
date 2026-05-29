'use client'

import {
	compareEnvFiles,
	generateComparisonReport,
	EnvComparison,
} from '@/utils/env-checker'
import { parseEnvText, ParsedEnvVariable } from '@/utils/env-parser'
import { Clipboard, Download } from 'lucide-react'
import { useMemo, useState } from 'react'

export function EnvChecker({
	projects,
}: {
	projects: {
		_id: string
		projectName: string
		variables: ParsedEnvVariable[]
	}[]
}) {
	const [projectId, setProjectId] = useState(projects[0]?._id || '')
	const [exampleContent, setExampleContent] = useState('')
	const project = projects.find((item) => item._id === projectId) || projects[0]
	const comparison = useMemo<EnvComparison>(() => {
		return compareEnvFiles(
			parseEnvText(exampleContent).variables,
			project?.variables || [],
		)
	}, [exampleContent, project])
	const report = generateComparisonReport(
		project?.projectName || 'Project',
		comparison,
	)

	async function copyReport() {
		await navigator.clipboard.writeText(report)
	}

	function downloadReport() {
		const blob = new Blob([report], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const anchor = document.createElement('a')
		anchor.href = url
		anchor.download = `${(project?.projectName || 'project').toLowerCase().replaceAll(' ', '-')}-env-report.txt`
		anchor.click()
		URL.revokeObjectURL(url)
	}

	if (projects.length === 0) {
		return (
			<div className='border-border bg-card text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm'>
				Create a project before checking missing environment variables.
			</div>
		)
	}

	return (
		<div className='grid gap-6 lg:grid-cols-[360px_1fr]'>
			<section className='border-border bg-card rounded-lg border p-5'>
				<label className='mb-4 block'>
					<span className='text-muted-foreground text-sm'>Project</span>
					<select
						value={projectId}
						onChange={(event) => setProjectId(event.target.value)}
						className='border-border bg-background text-foreground mt-1 w-full rounded-md border px-3 py-2'
					>
						{projects.map((item) => (
							<option key={item._id} value={item._id}>
								{item.projectName}
							</option>
						))}
					</select>
				</label>

				<label className='block'>
					<span className='text-muted-foreground text-sm'>
						.env.example content
					</span>
					<textarea
						value={exampleContent}
						onChange={(event) => setExampleContent(event.target.value)}
						rows={16}
						className='border-border bg-background text-foreground mt-1 w-full rounded-md border px-3 py-2 font-mono text-sm'
						placeholder='MONGODB_URI='
					/>
				</label>

				<div className='mt-4 flex gap-2'>
					<button
						type='button'
						onClick={copyReport}
						className='border-border text-foreground hover:bg-hover inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm'
					>
						<Clipboard className='h-4 w-4' />
						Copy report
					</button>
					<button
						type='button'
						onClick={downloadReport}
						className='bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:opacity-90'
					>
						<Download className='h-4 w-4' />
						Export
					</button>
				</div>
			</section>

			<section className='space-y-4'>
				<ResultBlock title='Available variables' items={comparison.available} />
				<ResultBlock
					title='Missing variables'
					items={comparison.missing}
					tone='danger'
				/>
				<ResultBlock title='Extra variables' items={comparison.extra} />
			</section>
		</div>
	)
}

function ResultBlock({
	title,
	items,
	tone = 'default',
}: {
	title: string
	items: string[]
	tone?: 'default' | 'danger'
}) {
	return (
		<div className='border-border bg-card rounded-lg border p-5'>
			<h2 className='text-card-foreground text-base font-semibold'>
				{title} ({items.length})
			</h2>
			<div className='mt-3 flex flex-wrap gap-2'>
				{items.length === 0 ? (
					<span className='text-muted-foreground text-sm'>None</span>
				) : (
					items.map((item) => (
						<span
							key={item}
							className={`rounded px-2 py-1 font-mono text-xs ${
								tone === 'danger'
									? 'bg-danger-foreground text-danger'
									: 'bg-secondary text-secondary-foreground'
							}`}
						>
							{item}
						</span>
					))
				)}
			</div>
		</div>
	)
}
