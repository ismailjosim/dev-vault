'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export type ProjectDocumentation = {
	clientRepo?: string
	serverRepo?: string
	liveURL?: string
	vercelURL?: string
	herokuURL?: string
	databaseName?: string
	adminEmail?: string
	testUserEmail?: string
	apiDocsURL?: string
	teamMembers?: string[]
	notes?: string
	status?: 'active' | 'archived' | 'completed'
}

export function ProjectDocs({
	projectId,
	documentation,
}: {
	projectId: string
	documentation: ProjectDocumentation
}) {
	const router = useRouter()
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsSubmitting(true)
		setError(null)

		const form = new FormData(event.currentTarget)
		const response = await fetch(`/api/projects/${projectId}/docs`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				clientRepo: form.get('clientRepo'),
				serverRepo: form.get('serverRepo'),
				liveURL: form.get('liveURL'),
				vercelURL: form.get('vercelURL'),
				herokuURL: form.get('herokuURL'),
				databaseName: form.get('databaseName'),
				adminEmail: form.get('adminEmail'),
				testUserEmail: form.get('testUserEmail'),
				apiDocsURL: form.get('apiDocsURL'),
				teamMembers: splitList(form.get('teamMembers')),
				notes: form.get('notes'),
				status: form.get('status'),
			}),
		})

		setIsSubmitting(false)

		if (!response.ok) {
			const payload = (await response.json()) as { message?: string }
			setError(payload.message || 'Could not save documentation')
			return
		}

		router.refresh()
	}

	return (
		<form
			onSubmit={onSubmit}
			className='border-border bg-card space-y-5 rounded-lg border p-6'
		>
			{error && (
				<div className='border-danger/30 bg-danger-foreground text-danger rounded border px-4 py-3 text-sm'>
					{error}
				</div>
			)}

			<div className='grid gap-4 sm:grid-cols-2'>
				<UrlField
					name='clientRepo'
					label='Client repo'
					defaultValue={documentation.clientRepo}
				/>
				<UrlField
					name='serverRepo'
					label='Server repo'
					defaultValue={documentation.serverRepo}
				/>
				<UrlField
					name='liveURL'
					label='Live URL'
					defaultValue={documentation.liveURL}
				/>
				<UrlField
					name='vercelURL'
					label='Vercel URL'
					defaultValue={documentation.vercelURL}
				/>
				<UrlField
					name='herokuURL'
					label='Heroku URL'
					defaultValue={documentation.herokuURL}
				/>
				<UrlField
					name='apiDocsURL'
					label='API docs URL'
					defaultValue={documentation.apiDocsURL}
				/>
			</div>

			<div className='grid gap-4 sm:grid-cols-2'>
				<TextField
					name='databaseName'
					label='Database name'
					defaultValue={documentation.databaseName}
				/>
				<label className='block'>
					<span className='text-foreground text-sm font-medium'>Status</span>
					<select
						name='status'
						defaultValue={documentation.status || 'active'}
						className='border-border bg-card text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 outline-none'
					>
						<option value='active'>Active</option>
						<option value='archived'>Archived</option>
						<option value='completed'>Completed</option>
					</select>
				</label>
				<TextField
					name='adminEmail'
					label='Admin email'
					type='email'
					defaultValue={documentation.adminEmail}
				/>
				<TextField
					name='testUserEmail'
					label='Test user email'
					type='email'
					defaultValue={documentation.testUserEmail}
				/>
			</div>

			<TextField
				name='teamMembers'
				label='Team members'
				defaultValue={(documentation.teamMembers || []).join(', ')}
				placeholder='Alice, Bob'
			/>

			<label className='block'>
				<span className='text-foreground text-sm font-medium'>
					Deployment notes
				</span>
				<textarea
					name='notes'
					defaultValue={documentation.notes}
					rows={8}
					className='border-border bg-card text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 outline-none'
					placeholder='Deployment steps, test credentials, known caveats'
				/>
			</label>

			<button
				type='submit'
				disabled={isSubmitting}
				className='bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60'
			>
				{isSubmitting ? 'Saving...' : 'Save documentation'}
			</button>
		</form>
	)
}

function UrlField({
	name,
	label,
	defaultValue,
}: {
	name: string
	label: string
	defaultValue?: string
}) {
	return (
		<TextField
			name={name}
			label={label}
			type='url'
			defaultValue={defaultValue}
			placeholder='https://'
		/>
	)
}

function TextField({
	name,
	label,
	defaultValue,
	placeholder,
	type = 'text',
}: {
	name: string
	label: string
	defaultValue?: string
	placeholder?: string
	type?: string
}) {
	return (
		<label className='block'>
			<span className='text-foreground text-sm font-medium'>{label}</span>
			<input
				name={name}
				type={type}
				defaultValue={defaultValue}
				placeholder={placeholder}
				className='border-border bg-card text-foreground focus:border-muted-foreground mt-1 w-full rounded-md border px-3 py-2 outline-none'
			/>
		</label>
	)
}

function splitList(value: FormDataEntryValue | null) {
	return String(value || '')
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean)
}
