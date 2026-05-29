'use client'

import { ImportPreview } from '@/components/import/ImportPreview'
import { detectEnvType, parseEnvText } from '@/utils/env-parser'
import { Upload } from 'lucide-react'
import { ChangeEvent, useMemo, useRef, useState } from 'react'

export function ImportEnvFile({
	projects,
}: {
	projects: { _id: string; projectName: string }[]
}) {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [projectId, setProjectId] = useState(projects[0]?._id || '')
	const [environment, setEnvironment] = useState('dev')
	const [content, setContent] = useState('')
	const [message, setMessage] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const parsed = useMemo(() => {
		const result = parseEnvText(content)
		return {
			...result,
			variables: result.variables.map((variable) => ({
				...variable,
				type: detectEnvType(variable.key, variable.value),
			})),
		}
	}, [content])

	async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]
		if (!file) return
		setContent(await file.text())
		event.target.value = ''
	}

	async function importVariables() {
		setIsSubmitting(true)
		setMessage(null)

		const variables = parsed.variables.map((variable) => ({
			key: variable.key,
			value: variable.value || ' ',
			type: variable.type,
			isPublic: variable.key.startsWith('NEXT_PUBLIC_'),
			note: 'Imported from .env file',
			environment,
		}))

		const response = await fetch(`/api/projects/${projectId}/env/import`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ variables }),
		})

		setIsSubmitting(false)

		if (!response.ok) {
			setMessage('Import failed. Check the preview for invalid lines.')
			return
		}

		const payload = (await response.json()) as { count: number }
		setMessage(
			`Imported ${payload.count} variable${payload.count === 1 ? '' : 's'}.`,
		)
	}

	if (projects.length === 0) {
		return (
			<div className='border-border bg-card text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm'>
				Create a project before importing environment files.
			</div>
		)
	}

	return (
		<div className='grid gap-6 lg:grid-cols-[360px_1fr]'>
			<section className='border-border bg-card rounded-lg border p-5'>
				<div className='space-y-4'>
					<label className='block'>
						<span className='text-muted-foreground text-sm'>Project</span>
						<select
							value={projectId}
							onChange={(event) => setProjectId(event.target.value)}
							className='border-border bg-background text-foreground mt-1 w-full rounded-md border px-3 py-2'
						>
							{projects.map((project) => (
								<option key={project._id} value={project._id}>
									{project.projectName}
								</option>
							))}
						</select>
					</label>

					<label className='block'>
						<span className='text-muted-foreground text-sm'>Environment</span>
						<select
							value={environment}
							onChange={(event) => setEnvironment(event.target.value)}
							className='border-border bg-background text-foreground mt-1 w-full rounded-md border px-3 py-2'
						>
							<option value='dev'>Development</option>
							<option value='staging'>Staging</option>
							<option value='prod'>Production</option>
							<option value='test'>Test</option>
						</select>
					</label>

					<input
						ref={fileInputRef}
						type='file'
						accept='.env,.txt'
						onChange={onFileChange}
						className='hidden'
					/>
					<button
						type='button'
						onClick={() => fileInputRef.current?.click()}
						className='border-border text-foreground hover:bg-hover inline-flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm'
					>
						<Upload className='h-4 w-4' />
						Upload .env file
					</button>

					<label className='block'>
						<span className='text-muted-foreground text-sm'>
							Paste .env content
						</span>
						<textarea
							value={content}
							onChange={(event) => setContent(event.target.value)}
							rows={12}
							className='border-border bg-background text-foreground mt-1 w-full rounded-md border px-3 py-2 font-mono text-sm'
							placeholder='MONGODB_URI=...'
						/>
					</label>

					<button
						type='button'
						onClick={importVariables}
						disabled={parsed.variables.length === 0 || isSubmitting}
						className='bg-primary text-primary-foreground w-full rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60'
					>
						{isSubmitting ? 'Importing...' : 'Import variables'}
					</button>

					{message && (
						<p className='text-muted-foreground text-sm'>{message}</p>
					)}
				</div>
			</section>

			<section>
				<ImportPreview variables={parsed.variables} />
				{parsed.invalidLines.length > 0 && (
					<div className='border-danger/30 bg-danger-foreground text-danger mt-4 rounded-lg border p-4 text-sm'>
						{parsed.invalidLines.map((line) => (
							<p key={`${line.lineNumber}-${line.content}`}>
								Line {line.lineNumber}: {line.reason}
							</p>
						))}
					</div>
				)}
			</section>
		</div>
	)
}
