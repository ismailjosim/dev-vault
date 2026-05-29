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
	const [expiryDate, setExpiryDate] = useState('')
	const [type, setType] = useState('other')
	const [isSensitive, setIsSensitive] = useState(true)
	const [isValueVisible, setIsValueVisible] = useState(false)
	const [selectedEnvironments, setSelectedEnvironments] = useState(['prod'])
	const [importedVariables, setImportedVariables] = useState<
		ParsedEnvVariable[]
	>([])
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
				expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
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
		setExpiryDate('')
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
				<button className='bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-semibold hover:opacity-90'>
					Add environment variable
				</button>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 z-40 bg-black/60' />
				<Dialog.Content className='border-border bg-card text-card-foreground fixed top-1/2 left-1/2 z-50 w-[calc(100vw-32px)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border shadow-2xl'>
					<div className='border-border flex items-center justify-between border-b px-5 py-4'>
						<Dialog.Title className='text-base font-semibold'>
							Add Environment Variable
						</Dialog.Title>
						<Dialog.Close className='text-muted-foreground hover:text-foreground rounded p-1'>
							<X className='h-4 w-4' />
						</Dialog.Close>
					</div>

					<div className='max-h-[75vh] overflow-y-auto px-5 py-4'>
						{error && (
							<div className='border-danger/30 bg-danger-foreground text-danger mb-4 rounded-md border px-3 py-2 text-sm'>
								{error}
							</div>
						)}

						<div className='space-y-4'>
							<label className='block'>
								<span className='text-muted-foreground text-xs font-medium'>
									Key
								</span>
								<input
									value={key}
									onChange={(event) => onKeyChange(event.target.value)}
									disabled={importedVariables.length > 0}
									className='border-border bg-background text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none disabled:opacity-60'
									placeholder='API_KEY'
								/>
							</label>

							<label className='block'>
								<span className='text-muted-foreground text-xs font-medium'>
									Value
								</span>
								<div className='border-border bg-background focus-within:border-muted-foreground mt-1 flex rounded-md border'>
									<input
										value={value}
										onChange={(event) => setValue(event.target.value)}
										disabled={importedVariables.length > 0}
										type={isValueVisible ? 'text' : 'password'}
										className='text-foreground min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none disabled:opacity-60'
										placeholder='secret value'
									/>
									<button
										type='button'
										onClick={() => setIsValueVisible((current) => !current)}
										className='text-muted-foreground hover:text-foreground px-3'
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
								<span className='text-muted-foreground text-xs font-medium'>
									Note (Optional)
								</span>
								<input
									value={note}
									onChange={(event) => setNote(event.target.value)}
									className='border-border bg-background text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none'
									placeholder='Where to rotate, or who to contact'
								/>
							</label>

							<label className='block'>
								<span className='text-muted-foreground text-xs font-medium'>
									Expiry date (Optional)
								</span>
								<input
									type='date'
									value={expiryDate}
									onChange={(event) => setExpiryDate(event.target.value)}
									className='border-border bg-background text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none'
								/>
							</label>
						</div>

						{importedVariables.length > 0 && (
							<div className='border-border mt-4 rounded-md border'>
								<div className='border-border flex items-center justify-between border-b px-3 py-2'>
									<span className='text-foreground text-sm'>
										Detected {importedVariables.length} variable
										{importedVariables.length === 1 ? '' : 's'}
									</span>
									<button
										type='button'
										onClick={() => setImportedVariables([])}
										className='text-muted-foreground hover:text-foreground text-xs'
									>
										Clear
									</button>
								</div>
								<div className='max-h-40 overflow-auto'>
									{importedVariables.map((variable) => (
										<div
											key={variable.key}
											className='border-border grid grid-cols-[1fr_120px] border-b px-3 py-2 text-sm last:border-b-0'
										>
											<span className='text-foreground truncate font-mono'>
												{variable.key}
											</span>
											<span className='text-muted-foreground font-mono'>
												••••••••
											</span>
										</div>
									))}
								</div>
							</div>
						)}

						<div className='border-border mt-5 border-t pt-4'>
							<div className='flex items-center justify-between gap-3'>
								<div className='flex items-center gap-2'>
									<button
										type='button'
										onClick={() => setIsSensitive((current) => !current)}
										className={`flex h-5 w-9 items-center rounded-full p-0.5 transition ${
											isSensitive ? 'bg-primary' : 'bg-secondary'
										}`}
									>
										<span
											className={`bg-card h-4 w-4 rounded-full transition ${
												isSensitive ? 'translate-x-4' : ''
											}`}
										/>
									</button>
									<span className='text-foreground text-sm'>Sensitive</span>
								</div>

								<select
									value={type}
									onChange={(event) => setType(event.target.value)}
									className='border-border bg-background text-foreground rounded-md border px-3 py-2 text-sm'
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
								<p className='text-muted-foreground text-xs font-medium'>
									Environments
								</p>
								<div className='mt-2 space-y-2'>
									{environments.map((environment) => (
										<label
											key={environment.id}
											className='border-border text-foreground flex items-center gap-2 rounded-md border px-3 py-2 text-sm'
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

					<div className='border-border flex items-center justify-between gap-3 border-t px-5 py-4'>
						<div className='text-muted-foreground flex flex-wrap items-center gap-2 text-xs'>
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
								className='border-border text-foreground hover:bg-hover inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm'
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
							className='bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60'
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
