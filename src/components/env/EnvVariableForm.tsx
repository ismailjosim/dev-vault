'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export function EnvVariableForm({ projectId }: { projectId: string }) {
	const router = useRouter()
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsSubmitting(true)
		setError(null)

		const form = new FormData(event.currentTarget)
		const response = await fetch(`/api/projects/${projectId}/env`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				key: form.get('key'),
				value: form.get('value'),
				type: form.get('type'),
				isPublic: form.get('isPublic') === 'on',
				note: form.get('note'),
				environment: form.get('environment'),
				expiryDate: form.get('expiryDate')
					? new Date(String(form.get('expiryDate'))).toISOString()
					: null,
			}),
		})

		setIsSubmitting(false)

		if (!response.ok) {
			const payload = (await response.json()) as { message?: string }
			setError(payload.message || 'Could not save variable')
			return
		}

		event.currentTarget.reset()
		router.refresh()
	}

	return (
		<form onSubmit={onSubmit} className='rounded-lg border border-zinc-200 bg-white p-4'>
			<h2 className='text-base font-semibold text-zinc-950'>Add variable</h2>
			{error && <p className='mt-3 text-sm text-red-600'>{error}</p>}

			<div className='mt-4 grid gap-3 md:grid-cols-2'>
				<input
					name='key'
					required
					placeholder='API_KEY'
					className='rounded-md border border-zinc-300 px-3 py-2 text-zinc-950'
				/>
				<input
					name='value'
					required
					placeholder='Value'
					className='rounded-md border border-zinc-300 px-3 py-2 text-zinc-950'
				/>
				<select
					name='type'
					className='rounded-md border border-zinc-300 px-3 py-2 text-zinc-950'
					defaultValue='other'
				>
					<option value='secret'>Secret</option>
					<option value='jwt'>JWT</option>
					<option value='api_key'>API key</option>
					<option value='url'>URL</option>
					<option value='database_url'>Database URL</option>
					<option value='other'>Other</option>
				</select>
				<select
					name='environment'
					className='rounded-md border border-zinc-300 px-3 py-2 text-zinc-950'
					defaultValue='dev'
				>
					<option value='dev'>Development</option>
					<option value='staging'>Staging</option>
					<option value='prod'>Production</option>
					<option value='test'>Test</option>
				</select>
				<input
					name='expiryDate'
					type='date'
					className='rounded-md border border-zinc-300 px-3 py-2 text-zinc-950'
				/>
				<label className='flex items-center gap-2 text-sm text-zinc-700'>
					<input name='isPublic' type='checkbox' className='h-4 w-4' />
					Public variable
				</label>
			</div>

			<textarea
				name='note'
				rows={2}
				placeholder='Note'
				className='mt-3 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950'
			/>

			<button
				type='submit'
				disabled={isSubmitting}
				className='mt-3 rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60'
			>
				{isSubmitting ? 'Saving...' : 'Save variable'}
			</button>
		</form>
	)
}
