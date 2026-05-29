'use client'

import { Clipboard } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const labels: Record<string, string> = {
	all: 'All',
	dev: 'Development',
	staging: 'Staging',
	prod: 'Production',
	test: 'Test',
}

export function EnvironmentTabs({
	projectId,
	currentEnvironment,
	environments,
}: {
	projectId: string
	currentEnvironment: string
	environments: string[]
}) {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [copied, setCopied] = useState(false)
	const options = ['all', ...environments.filter((environment) => environment)]

	function hrefFor(environment: string) {
		const next = new URLSearchParams(searchParams)
		if (environment === 'all') next.delete('environment')
		else next.set('environment', environment)
		return `${pathname}?${next.toString()}`
	}

	async function copyCurrentEnvironment() {
		const response = await fetch(`/api/projects/${projectId}/export`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				format: 'env',
				environment:
					currentEnvironment === 'all' ? undefined : currentEnvironment,
			}),
		})
		const payload = (await response.json()) as { content: string }
		await navigator.clipboard.writeText(payload.content)
		setCopied(true)
		window.setTimeout(() => setCopied(false), 1500)
	}

	return (
		<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
			<div className='flex flex-wrap gap-2'>
				{options.map((environment) => {
					const isActive = environment === currentEnvironment

					return (
						<Link
							key={environment}
							href={hrefFor(environment)}
							className={`rounded-md border px-3 py-2 text-sm transition ${
								isActive
									? 'border-primary bg-primary text-primary-foreground'
									: 'border-border bg-card text-foreground hover:bg-hover'
							}`}
						>
							{labels[environment] || environment}
						</Link>
					)
				})}
			</div>

			<button
				type='button'
				onClick={copyCurrentEnvironment}
				className='border-border text-foreground hover:bg-hover inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm'
			>
				<Clipboard className='h-4 w-4' />
				{copied ? 'Copied' : 'Copy current .env'}
			</button>
		</div>
	)
}
