'use client'

import { Pin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function PinProjectButton({
	projectId,
	isPinned,
}: {
	projectId: string
	isPinned: boolean
}) {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)

	async function togglePin() {
		setIsSubmitting(true)
		await fetch(`/api/projects/${projectId}/pin`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ isPinned: !isPinned }),
		})
		setIsSubmitting(false)
		router.refresh()
	}

	return (
		<button
			type='button'
			onClick={togglePin}
			disabled={isSubmitting}
			className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition disabled:opacity-60 ${
				isPinned
					? 'border-amber-300 bg-amber-100 text-amber-900'
					: 'border-border text-foreground hover:bg-hover'
			}`}
		>
			<Pin className='h-4 w-4' />
			{isPinned ? 'Pinned' : 'Pin'}
		</button>
	)
}
