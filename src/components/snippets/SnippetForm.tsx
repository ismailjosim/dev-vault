'use client'

import { CodeEditor } from '@/components/snippets/CodeEditor'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

const categories = [
	'Cloudinary',
	'MongoDB',
	'Better Auth',
	'Stripe',
	'Firebase',
	'Axios',
	'AWS',
	'JWT',
	'Other',
]

const languages = [
	'javascript',
	'typescript',
	'python',
	'bash',
	'sql',
	'json',
	'yaml',
	'dockerfile',
	'other',
]

export function SnippetForm() {
	const router = useRouter()
	const [code, setCode] = useState('')
	const [isPublic, setIsPublic] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsSubmitting(true)
		setError(null)

		const form = new FormData(event.currentTarget)
		const response = await fetch('/api/snippets', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				title: form.get('title'),
				category: form.get('category'),
				language: form.get('language'),
				description: form.get('description'),
				code,
				requiredEnv: splitList(form.get('requiredEnv')),
				tags: splitList(form.get('tags')),
				isPublic,
			}),
		})

		setIsSubmitting(false)

		if (!response.ok) {
			const payload = (await response.json()) as { message?: string }
			setError(payload.message || 'Could not create snippet')
			return
		}

		const payload = (await response.json()) as { snippet: { _id: string } }
		router.push(`/dashboard/snippets/${payload.snippet._id}`)
		router.refresh()
	}

	return (
		<form onSubmit={onSubmit} className='space-y-5'>
			{error && (
				<div className='border-danger/30 bg-danger-foreground text-danger rounded border px-4 py-3 text-sm'>
					{error}
				</div>
			)}

			<div>
				<label className='text-foreground block text-sm font-medium'>
					Title
				</label>
				<input
					name='title'
					required
					className='border-border bg-card text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 outline-none'
					placeholder='Stripe webhook verifier'
				/>
			</div>

			<div>
				<label className='text-foreground block text-sm font-medium'>
					Description
				</label>
				<textarea
					name='description'
					rows={3}
					className='border-border bg-card text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 outline-none'
					placeholder='What this snippet does and where to use it'
				/>
			</div>

			<div className='grid gap-4 sm:grid-cols-2'>
				<label className='block'>
					<span className='text-foreground text-sm font-medium'>Category</span>
					<select
						name='category'
						className='border-border bg-card text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 outline-none'
					>
						{categories.map((category) => (
							<option key={category}>{category}</option>
						))}
					</select>
				</label>

				<label className='block'>
					<span className='text-foreground text-sm font-medium'>Language</span>
					<select
						name='language'
						className='border-border bg-card text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 outline-none'
					>
						{languages.map((language) => (
							<option key={language}>{language}</option>
						))}
					</select>
				</label>
			</div>

			<label className='block'>
				<span className='text-foreground text-sm font-medium'>Code</span>
				<CodeEditor value={code} onChange={setCode} />
			</label>

			<div className='grid gap-4 sm:grid-cols-2'>
				<label className='block'>
					<span className='text-foreground text-sm font-medium'>
						Required env
					</span>
					<input
						name='requiredEnv'
						className='border-border bg-card text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 outline-none'
						placeholder='MONGODB_URI, JWT_ACCESS_SECRET'
					/>
				</label>

				<label className='block'>
					<span className='text-foreground text-sm font-medium'>Tags</span>
					<input
						name='tags'
						className='border-border bg-card text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 outline-none'
						placeholder='auth, api, upload'
					/>
				</label>
			</div>

			<label className='text-foreground flex items-center gap-2 text-sm'>
				<input
					type='checkbox'
					checked={isPublic}
					onChange={(event) => setIsPublic(event.target.checked)}
					className='h-4 w-4'
				/>
				Public snippet
			</label>

			<button
				type='submit'
				disabled={isSubmitting || !code.trim()}
				className='bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60'
			>
				{isSubmitting ? 'Creating...' : 'Create snippet'}
			</button>
		</form>
	)
}

function splitList(value: FormDataEntryValue | null) {
	return String(value || '')
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean)
}
