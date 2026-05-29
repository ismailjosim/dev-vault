'use client'

import { parseEnvText, ParsedEnvVariable } from '@/utils/env-parser'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useMemo, useState } from 'react'

export function EnvImportPanel({ projectId }: { projectId: string }) {
	const router = useRouter()
	const [source, setSource] = useState('')
	const [environment, setEnvironment] = useState('dev')
	const [type, setType] = useState('other')
	const [isPublic, setIsPublic] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [message, setMessage] = useState<string | null>(null)
	const parsed = useMemo(() => parseEnvText(source), [source])

	async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]
		if (!file) return

		setSource(await file.text())
		setMessage(null)
	}

	async function importVariables() {
		setIsSaving(true)
		setMessage(null)

		const response = await fetch(`/api/projects/${projectId}/env/import`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				variables: parsed.variables.map((variable) => ({
					...variable,
					type,
					isPublic,
					note: 'Imported from .env',
					environment,
				})),
			}),
		})

		setIsSaving(false)

		if (!response.ok) {
			const payload = (await response.json()) as { message?: string }
			setMessage(payload.message || 'Import failed')
			return
		}

		const payload = (await response.json()) as { count: number }
		setMessage(`Imported ${payload.count} variable${payload.count === 1 ? '' : 's'}`)
		setSource('')
		router.refresh()
	}

	return (
		<section className='rounded-lg border border-zinc-200 bg-white p-4'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<h2 className='text-base font-semibold text-zinc-950'>Import .env</h2>
				<input
					type='file'
					accept='.env,.txt'
					onChange={onFileChange}
					className='text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white'
				/>
			</div>

			<textarea
				value={source}
				onChange={(event) => {
					setSource(event.target.value)
					setMessage(null)
				}}
				rows={8}
				placeholder='DATABASE_URL=...'
				className='mt-4 w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm text-zinc-950'
			/>

			<div className='mt-3 grid gap-3 sm:grid-cols-3'>
				<select
					value={environment}
					onChange={(event) => setEnvironment(event.target.value)}
					className='rounded-md border border-zinc-300 px-3 py-2 text-zinc-950'
				>
					<option value='dev'>Development</option>
					<option value='staging'>Staging</option>
					<option value='prod'>Production</option>
					<option value='test'>Test</option>
				</select>

				<select
					value={type}
					onChange={(event) => setType(event.target.value)}
					className='rounded-md border border-zinc-300 px-3 py-2 text-zinc-950'
				>
					<option value='secret'>Secret</option>
					<option value='jwt'>JWT</option>
					<option value='api_key'>API key</option>
					<option value='url'>URL</option>
					<option value='database_url'>Database URL</option>
					<option value='other'>Other</option>
				</select>

				<label className='flex items-center gap-2 text-sm text-zinc-700'>
					<input
						type='checkbox'
						checked={isPublic}
						onChange={(event) => setIsPublic(event.target.checked)}
						className='h-4 w-4'
					/>
					Public variable
				</label>
			</div>

			<ImportPreview variables={parsed.variables} />

			{parsed.invalidLines.length > 0 && (
				<p className='mt-3 text-sm text-amber-700'>
					Skipped {parsed.invalidLines.length} line
					{parsed.invalidLines.length === 1 ? '' : 's'}.
				</p>
			)}

			{message && <p className='mt-3 text-sm text-zinc-700'>{message}</p>}

			<button
				type='button'
				onClick={importVariables}
				disabled={parsed.variables.length === 0 || isSaving}
				className='mt-4 rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60'
			>
				{isSaving ? 'Importing...' : `Import ${parsed.variables.length}`}
			</button>
		</section>
	)
}

function ImportPreview({ variables }: { variables: ParsedEnvVariable[] }) {
	if (variables.length === 0) {
		return null
	}

	return (
		<div className='mt-4 max-h-52 overflow-auto rounded-md border border-zinc-200'>
			<table className='w-full text-left text-sm'>
				<thead className='bg-zinc-50 text-xs uppercase text-zinc-500'>
					<tr>
						<th className='px-3 py-2'>Key</th>
						<th className='px-3 py-2'>Value</th>
					</tr>
				</thead>
				<tbody>
					{variables.map((variable) => (
						<tr key={variable.key} className='border-t border-zinc-200'>
							<td className='px-3 py-2 font-mono text-zinc-950'>{variable.key}</td>
							<td className='px-3 py-2 font-mono text-zinc-600'>••••••••</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
