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
				<div className='border-danger/30 bg-danger-foreground text-danger rounded border px-4 py-3 text-sm'>
					{error}
				</div>
			)}

			<div>
				<label className='text-foreground block text-sm font-medium'>
					Name
				</label>
				<input
					name='projectName'
					required
					className='border-border bg-card text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 outline-none'
					placeholder='DevVault'
				/>
			</div>

			<div>
				<label className='text-foreground block text-sm font-medium'>
					Description
				</label>
				<textarea
					name='description'
					rows={4}
					className='border-border bg-card text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 outline-none'
					placeholder='What does this project use these variables for?'
				/>
			</div>

			<div className='grid gap-4 sm:grid-cols-2'>
				<div>
					<label className='text-foreground block text-sm font-medium'>
						Category
					</label>
					<select
						name='category'
						className='border-border bg-card text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 outline-none'
					>
						<option>Full Stack</option>
						<option>Frontend</option>
						<option>Backend</option>
						<option>Mobile</option>
						<option>Other</option>
					</select>
				</div>

				<div>
					<label className='text-foreground block text-sm font-medium'>
						Framework
					</label>
					<input
						name='framework'
						defaultValue='Next.js'
						className='border-border bg-card text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 outline-none'
					/>
				</div>
			</div>

			<div>
				<label className='text-foreground block text-sm font-medium'>
					Tags
				</label>
				<input
					name='tags'
					className='border-border bg-card text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 outline-none'
					placeholder='auth, payments, production'
				/>
			</div>

			<button
				type='submit'
				disabled={isSubmitting}
				className='bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60'
			>
				{isSubmitting ? 'Creating...' : 'Create project'}
			</button>
		</form>
	)
}
