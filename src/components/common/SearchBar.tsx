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
				className='border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-muted-foreground w-full rounded-md border px-3 py-2 outline-none'
			/>
			<button className='bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-semibold hover:opacity-90'>
				Search
			</button>
		</form>
	)
}
