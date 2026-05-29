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
			className='rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 disabled:opacity-60'
		>
			{isDeleting ? 'Deleting...' : 'Delete'}
		</button>
	)
}
