'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { ProjectSummary } from '@/components/projects/ProjectCard'
import { BuiltInTemplate } from '@/utils/templates'
import { Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function UseTemplateModal({
	template,
	projects,
}: {
	template: BuiltInTemplate
	projects: ProjectSummary[]
}) {
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [projectId, setProjectId] = useState(projects[0]?._id || '')
	const [environment, setEnvironment] = useState('dev')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function applyTemplate() {
		if (!projectId) return

		setIsSubmitting(true)
		setError(null)

		const response = await fetch(
			`/api/projects/${projectId}/apply-template/${template.id}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ environment }),
			},
		)

		setIsSubmitting(false)

		if (!response.ok) {
			const payload = (await response.json()) as { message?: string }
			setError(payload.message || 'Could not apply template')
			return
		}

		setOpen(false)
		router.push(`/dashboard/projects/${projectId}`)
		router.refresh()
	}

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<button
					type='button'
					className='rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90'
				>
					Use template
				</button>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 z-40 bg-black/60' />
				<Dialog.Content className='fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card text-card-foreground shadow-2xl'>
					<div className='flex items-center justify-between border-b border-border px-5 py-4'>
						<Dialog.Title className='text-base font-semibold'>
							Apply {template.name}
						</Dialog.Title>
						<Dialog.Close className='rounded p-1 text-muted-foreground hover:text-foreground'>
							<X className='h-4 w-4' />
						</Dialog.Close>
					</div>

					<div className='space-y-4 px-5 py-4'>
						{error && (
							<div className='rounded-md border border-danger/30 bg-danger-foreground px-3 py-2 text-sm text-danger'>
								{error}
							</div>
						)}

						<label className='block'>
							<span className='text-sm text-muted-foreground'>Project</span>
							<select
								value={projectId}
								onChange={(event) => setProjectId(event.target.value)}
								className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground'
							>
								{projects.map((project) => (
									<option key={project._id} value={project._id}>
										{project.projectName}
									</option>
								))}
							</select>
						</label>

						<label className='block'>
							<span className='text-sm text-muted-foreground'>Environment</span>
							<select
								value={environment}
								onChange={(event) => setEnvironment(event.target.value)}
								className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground'
							>
								<option value='dev'>Development</option>
								<option value='staging'>Staging</option>
								<option value='prod'>Production</option>
								<option value='test'>Test</option>
							</select>
						</label>

						<p className='text-sm text-muted-foreground'>
							This will add empty variables from the template. Existing matching keys
							in the selected environment are left untouched.
						</p>
					</div>

					<div className='flex justify-end gap-3 border-t border-border px-5 py-4'>
						<Dialog.Close className='rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-hover'>
							Cancel
						</Dialog.Close>
						<button
							type='button'
							onClick={applyTemplate}
							disabled={!projectId || isSubmitting}
							className='inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60'
						>
							<Check className='h-4 w-4' />
							{isSubmitting ? 'Applying...' : 'Apply'}
						</button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
