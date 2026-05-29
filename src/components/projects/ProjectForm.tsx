'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export function ProjectForm() {
	const router = useRouter()
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsSubmitting(true)
		setError(null)

		const form = new FormData(event.currentTarget)
		const response = await fetch('/api/projects', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				projectName: form.get('projectName'),
				description: form.get('description'),
				category: form.get('category'),
				framework: form.get('framework'),
				tags: String(form.get('tags') || '')
					.split(',')
					.map((tag) => tag.trim())
					.filter(Boolean),
			}),
		})

		setIsSubmitting(false)

		if (!response.ok) {
			const payload = (await response.json()) as { message?: string }
			setError(payload.message || 'Could not create project')
			return
		}

		const payload = (await response.json()) as { project: { _id: string } }
		router.push(`/dashboard/projects/${payload.project._id}`)
		router.refresh()
	}

	return (
		<form onSubmit={onSubmit} className='max-w-2xl space-y-5'>
			{error && (
				<div className='rounded border border-danger/30 bg-danger-foreground px-4 py-3 text-sm text-danger'>
					{error}
				</div>
			)}

			<div>
				<label className='block text-sm font-medium text-foreground'>Name</label>
				<input
					name='projectName'
					required
					className='mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-muted-foreground'
					placeholder='DevVault'
				/>
			</div>

			<div>
				<label className='block text-sm font-medium text-foreground'>
					Description
				</label>
				<textarea
					name='description'
					rows={4}
					className='mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-muted-foreground'
					placeholder='What does this project use these variables for?'
				/>
			</div>

			<div className='grid gap-4 sm:grid-cols-2'>
				<div>
					<label className='block text-sm font-medium text-foreground'>
						Category
					</label>
					<select
						name='category'
						className='mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-muted-foreground'
					>
						<option>Full Stack</option>
						<option>Frontend</option>
						<option>Backend</option>
						<option>Mobile</option>
						<option>Other</option>
					</select>
				</div>

				<div>
					<label className='block text-sm font-medium text-foreground'>
						Framework
					</label>
					<input
						name='framework'
						defaultValue='Next.js'
						className='mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-muted-foreground'
					/>
				</div>
			</div>

			<div>
				<label className='block text-sm font-medium text-foreground'>Tags</label>
				<input
					name='tags'
					className='mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-muted-foreground'
					placeholder='auth, payments, production'
				/>
			</div>

			<button
				type='submit'
				disabled={isSubmitting}
				className='rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60'
			>
				{isSubmitting ? 'Creating...' : 'Create project'}
			</button>
		</form>
	)
}
