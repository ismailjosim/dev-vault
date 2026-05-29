'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export type EnvVariableSummary = {
	_id: string
	key: string
	value: string | null
	type: string
	isPublic: boolean
	note: string
	environment: string
	expiryDate?: string | null
	updatedAt: string
}

export function EnvVariableItem({
	projectId,
	variable,
}: {
	projectId: string
	variable: EnvVariableSummary
}) {
	const router = useRouter()
	const [copied, setCopied] = useState<string | null>(null)

	async function copyValue(format: 'key' | 'value' | 'pair') {
		const response = await fetch(`/api/projects/${projectId}/env?reveal=true`)
		const payload = (await response.json()) as { variables: EnvVariableSummary[] }
		const current = payload.variables.find((item) => item._id === variable._id)
		const value = current?.value || ''
		const text =
			format === 'key'
				? variable.key
				: format === 'pair'
					? `${variable.key}=${value}`
					: value

		await navigator.clipboard.writeText(text)
		setCopied(format)
		window.setTimeout(() => {
			navigator.clipboard.writeText('')
			setCopied(null)
		}, 30000)
	}

	async function deleteVariable() {
		await fetch(`/api/projects/${projectId}/env/${variable._id}`, {
			method: 'DELETE',
		})
		router.refresh()
	}

	return (
		<tr className='border-t border-zinc-200'>
			<td className='px-3 py-3 font-mono text-sm text-zinc-950'>{variable.key}</td>
			<td className='px-3 py-3 text-sm text-zinc-600'>••••••••</td>
			<td className='px-3 py-3'>
				<span className='rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700'>
					{variable.type}
				</span>
			</td>
			<td className='px-3 py-3 text-sm text-zinc-600'>{variable.environment}</td>
			<td className='px-3 py-3 text-sm text-zinc-600'>
				{variable.expiryDate
					? `Expires ${variable.expiryDate.slice(0, 10)}`
					: variable.note}
			</td>
			<td className='px-3 py-3 text-right'>
				<div className='flex justify-end gap-2'>
					<button onClick={() => copyValue('key')} className='text-sm text-zinc-700'>
						{copied === 'key' ? 'Copied' : 'Key'}
					</button>
					<button onClick={() => copyValue('value')} className='text-sm text-zinc-700'>
						{copied === 'value' ? 'Copied' : 'Value'}
					</button>
					<button onClick={() => copyValue('pair')} className='text-sm text-zinc-700'>
						{copied === 'pair' ? 'Copied' : 'KEY=VALUE'}
					</button>
					<button onClick={deleteVariable} className='text-sm text-red-700'>
						Delete
					</button>
				</div>
			</td>
		</tr>
	)
}
