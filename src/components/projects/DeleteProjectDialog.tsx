'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteProjectDialog({ projectId }: { projectId: string }) {
	const router = useRouter()
	const [isDeleting, setIsDeleting] = useState(false)

	async function deleteProject() {
		if (!window.confirm('Delete this project and all environment variables?')) {
			return
		}

		setIsDeleting(true)
		await fetch(`/api/projects/${projectId}`, { method: 'DELETE' })
		router.push('/dashboard')
		router.refresh()
	}

	return (
		<button
			type='button'
			onClick={deleteProject}
			disabled={isDeleting}
			className='border-danger/40 text-danger rounded-md border px-3 py-2 text-sm font-medium disabled:opacity-60'
		>
			{isDeleting ? 'Deleting...' : 'Delete'}
		</button>
	)
}
