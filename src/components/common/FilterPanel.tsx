'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent } from 'react'

export function FilterPanel() {
	const router = useRouter()
	const params = useSearchParams()

	function setFilter(event: ChangeEvent<HTMLSelectElement>) {
		const next = new URLSearchParams(params)
		if (event.target.value) {
			next.set(event.target.name, event.target.value)
		} else {
			next.delete(event.target.name)
		}
		router.push(`/dashboard?${next.toString()}`)
	}

	return (
		<div className='grid gap-3 sm:grid-cols-2'>
			<select
				name='category'
				onChange={setFilter}
				defaultValue={params.get('category') || ''}
				className='border-border bg-card text-foreground focus:border-muted-foreground rounded-md border px-3 py-2 outline-none'
			>
				<option value=''>All categories</option>
				<option>Full Stack</option>
				<option>Frontend</option>
				<option>Backend</option>
				<option>Mobile</option>
				<option>Other</option>
			</select>
			<select
				name='framework'
				onChange={setFilter}
				defaultValue={params.get('framework') || ''}
				className='border-border bg-card text-foreground focus:border-muted-foreground rounded-md border px-3 py-2 outline-none'
			>
				<option value=''>All frameworks</option>
				<option>Next.js</option>
				<option>React</option>
				<option>Node.js</option>
				<option>MERN</option>
				<option>Other</option>
			</select>
		</div>
	)
}
