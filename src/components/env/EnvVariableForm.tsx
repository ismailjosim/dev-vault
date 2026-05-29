'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { parseEnvText, ParsedEnvVariable } from '@/utils/env-parser'
import { Eye, EyeOff, Plus, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useMemo, useRef, useState } from 'react'

const environments = [
	{ id: 'prod', label: 'Production' },
	{ id: 'staging', label: 'Preview' },
	{ id: 'dev', label: 'Development' },
	{ id: 'test', label: 'Test' },
]

export function EnvVariableForm({ projectId }: { projectId: string }) {
	const router = useRouter()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [open, setOpen] = useState(false)
	const [key, setKey] = useState('')
	const [value, setValue] = useState('')
	const [note, setNote] = useState('')
	const [type, setType] = useState('other')
	const [isSensitive, setIsSensitive] = useState(true)
	const [isValueVisible, setIsValueVisible] = useState(false)
	const [selectedEnvironments, setSelectedEnvironments] = useState(['prod'])
	const [importedVariables, setImportedVariables] = useState<ParsedEnvVariable[]>(
		[],
	)
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const variablesToSave = useMemo(() => {
		if (importedVariables.length > 0) return importedVariables
		if (!key.trim() || !value) return []
		return [{ key: key.trim(), value }]
	}, [importedVariables, key, value])

	async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]
		if (!file) return

		applyEnvText(await file.text())
		event.target.value = ''
	}

	function onKeyChange(nextValue: string) {
		setKey(nextValue)
		setError(null)

		if (nextValue.includes('\n') || nextValue.includes('=')) {
			const parsed = parseEnvText(nextValue)
			if (parsed.variables.length > 0) {
				setImportedVariables(parsed.variables)
				setKey('')
				setValue('')
			}
		}
	}

	function applyEnvText(text: string) {
		const parsed = parseEnvText(text)

		if (parsed.variables.length === 0) {
			setError('No environment variables were detected.')
			return
		}

		setImportedVariables(parsed.variables)
		setKey('')
		setValue('')
		setError(null)
	}

	function toggleEnvironment(environment: string) {
		setSelectedEnvironments((current) => {
			if (current.includes(environment)) {
				return current.length === 1
					? current
					: current.filter((item) => item !== environment)
			}

			return [...current, environment]
		})
	}

	async function saveVariables() {
		setIsSubmitting(true)
		setError(null)

		const payload = selectedEnvironments.flatMap((environment) =>
			variablesToSave.map((variable) => ({
				...variable,
				type,
				isPublic: !isSensitive,
				note,
				environment,
			})),
		)

		const response = await fetch(`/api/projects/${projectId}/env/import`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ variables: payload }),
		})

		setIsSubmitting(false)

		if (!response.ok) {
			const result = (await response.json()) as { message?: string }
			setError(result.message || 'Could not save environment variables.')
			return
		}

		resetForm()
		setOpen(false)
		router.refresh()
	}

	function resetForm() {
		setKey('')
		setValue('')
		setNote('')
		setType('other')
		setIsSensitive(true)
		setIsValueVisible(false)
		setSelectedEnvironments(['prod'])
		setImportedVariables([])
		setError(null)
	}

	return (
		<Dialog.Root
			open={open}
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen)
				if (!nextOpen) resetForm()
			}}
		>
			<Dialog.Trigger asChild>
				<button className='rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white'>
					Add environment variable
				</button>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 z-40 bg-black/60' />
				<Dialog.Content className='fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl'>
					<div className='flex items-center justify-between border-b border-zinc-800 px-5 py-4'>
						<Dialog.Title className='text-base font-semibold'>
							Add Environment Variable
						</Dialog.Title>
						<Dialog.Close className='rounded p-1 text-zinc-400 hover:text-white'>
							<X className='h-4 w-4' />
						</Dialog.Close>
					</div>

					<div className='max-h-[75vh] overflow-y-auto px-5 py-4'>
						{error && (
							<div className='mb-4 rounded-md border border-red-900 bg-red-950/60 px-3 py-2 text-sm text-red-200'>
								{error}
							</div>
						)}

						<div className='space-y-4'>
							<label className='block'>
								<span className='text-xs font-medium text-zinc-400'>Key</span>
								<input
									value={key}
									onChange={(event) => onKeyChange(event.target.value)}
									disabled={importedVariables.length > 0}
									className='mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500 disabled:opacity-60'
									placeholder='API_KEY'
								/>
							</label>

							<label className='block'>
								<span className='text-xs font-medium text-zinc-400'>Value</span>
								<div className='mt-1 flex rounded-md border border-zinc-800 focus-within:border-zinc-500'>
									<input
										value={value}
										onChange={(event) => setValue(event.target.value)}
										disabled={importedVariables.length > 0}
										type={isValueVisible ? 'text' : 'password'}
										className='min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none disabled:opacity-60'
										placeholder='secret value'
									/>
									<button
										type='button'
										onClick={() => setIsValueVisible((current) => !current)}
										className='px-3 text-zinc-400 hover:text-white'
									>
										{isValueVisible ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
									</button>
								</div>
							</label>

							<label className='block'>
								<span className='text-xs font-medium text-zinc-400'>
									Note (Optional)
								</span>
								<input
									value={note}
									onChange={(event) => setNote(event.target.value)}
									className='mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500'
									placeholder='Where to rotate, or who to contact'
								/>
							</label>
						</div>

						{importedVariables.length > 0 && (
							<div className='mt-4 rounded-md border border-zinc-800'>
								<div className='flex items-center justify-between border-b border-zinc-800 px-3 py-2'>
									<span className='text-sm text-zinc-300'>
										Detected {importedVariables.length} variable
										{importedVariables.length === 1 ? '' : 's'}
									</span>
									<button
										type='button'
										onClick={() => setImportedVariables([])}
										className='text-xs text-zinc-400 hover:text-white'
									>
										Clear
									</button>
								</div>
								<div className='max-h-40 overflow-auto'>
									{importedVariables.map((variable) => (
										<div
											key={variable.key}
											className='grid grid-cols-[1fr_120px] border-b border-zinc-900 px-3 py-2 text-sm last:border-b-0'
										>
											<span className='truncate font-mono text-zinc-100'>
												{variable.key}
											</span>
											<span className='font-mono text-zinc-500'>••••••••</span>
										</div>
									))}
								</div>
							</div>
						)}

						<div className='mt-5 border-t border-zinc-800 pt-4'>
							<div className='flex items-center justify-between gap-3'>
								<div className='flex items-center gap-2'>
									<button
										type='button'
										onClick={() => setIsSensitive((current) => !current)}
										className={`flex h-5 w-9 items-center rounded-full p-0.5 transition ${
											isSensitive ? 'bg-violet-500' : 'bg-zinc-700'
										}`}
									>
										<span
											className={`h-4 w-4 rounded-full bg-white transition ${
												isSensitive ? 'translate-x-4' : ''
											}`}
										/>
									</button>
									<span className='text-sm text-zinc-300'>Sensitive</span>
								</div>

								<select
									value={type}
									onChange={(event) => setType(event.target.value)}
									className='rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100'
								>
									<option value='secret'>Secret</option>
									<option value='jwt'>JWT</option>
									<option value='api_key'>API key</option>
									<option value='url'>URL</option>
									<option value='database_url'>Database URL</option>
									<option value='other'>Other</option>
								</select>
							</div>

							<div className='mt-4'>
								<p className='text-xs font-medium text-zinc-400'>Environments</p>
								<div className='mt-2 space-y-2'>
									{environments.map((environment) => (
										<label
											key={environment.id}
											className='flex items-center gap-2 rounded-md border border-zinc-800 px-3 py-2 text-sm text-zinc-200'
										>
											<input
												type='checkbox'
												checked={selectedEnvironments.includes(environment.id)}
												onChange={() => toggleEnvironment(environment.id)}
												className='h-4 w-4'
											/>
											{environment.label}
										</label>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className='flex items-center justify-between gap-3 border-t border-zinc-800 px-5 py-4'>
						<div className='flex flex-wrap items-center gap-2 text-xs text-zinc-500'>
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
								className='inline-flex items-center gap-2 rounded-md border border-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-600'
							>
								<Upload className='h-4 w-4' />
								Import .env
							</button>
							<span>or paste .env contents in Key input</span>
						</div>

						<button
							type='button'
							onClick={saveVariables}
							disabled={variablesToSave.length === 0 || isSubmitting}
							className='inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-60'
						>
							{importedVariables.length === 0 && <Plus className='h-4 w-4' />}
							{isSubmitting ? 'Saving...' : 'Save'}
						</button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
