'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent } from 'react'

export function SearchBar() {
	const router = useRouter()
	const params = useSearchParams()

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const form = new FormData(event.currentTarget)
		const next = new URLSearchParams(params)
		next.set('search', String(form.get('search') || ''))
		router.push(`/dashboard?${next.toString()}`)
	}

	return (
		<form onSubmit={onSubmit} className='flex gap-2'>
			<input
				name='search'
				defaultValue={params.get('search') || ''}
				placeholder='Search projects'
				className='w-full rounded-md border border-border bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground outline-none focus:border-muted-foreground'
			/>
			<button className='rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90'>
				Search
			</button>
		</form>
	)
}
