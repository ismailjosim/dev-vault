'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, FormEvent } from 'react'

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

export function CategoryFilter({ categories }: { categories: string[] }) {
	const router = useRouter()
	const params = useSearchParams()

	function updateParam(name: string, value: string) {
		const next = new URLSearchParams(params)
		if (value) next.set(name, value)
		else next.delete(name)
		router.push(`/dashboard/snippets?${next.toString()}`)
	}

	function onSearch(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const form = new FormData(event.currentTarget)
		updateParam('search', String(form.get('search') || ''))
	}

	function onSelect(event: ChangeEvent<HTMLSelectElement>) {
		updateParam(event.target.name, event.target.value)
	}

	return (
		<div className='grid gap-3 lg:grid-cols-[1fr_220px_220px]'>
			<form onSubmit={onSearch} className='flex gap-2'>
				<input
					name='search'
					defaultValue={params.get('search') || ''}
					placeholder='Search snippets'
					className='border-border bg-card text-foreground focus:border-muted-foreground w-full rounded-md border px-3 py-2 outline-none'
				/>
				<button className='bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-semibold hover:opacity-90'>
					Search
				</button>
			</form>

			<select
				name='category'
				onChange={onSelect}
				defaultValue={params.get('category') || ''}
				className='border-border bg-card text-foreground focus:border-muted-foreground rounded-md border px-3 py-2 outline-none'
			>
				<option value=''>All categories</option>
				{categories.map((category) => (
					<option key={category}>{category}</option>
				))}
			</select>

			<select
				name='language'
				onChange={onSelect}
				defaultValue={params.get('language') || ''}
				className='border-border bg-card text-foreground focus:border-muted-foreground rounded-md border px-3 py-2 outline-none'
			>
				<option value=''>All languages</option>
				{languages.map((language) => (
					<option key={language}>{language}</option>
				))}
			</select>
		</div>
	)
}
