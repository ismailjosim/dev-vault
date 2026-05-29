'use client'

import { Clipboard, Copy, Eye, EyeOff, FileCode2, Trash2 } from 'lucide-react'
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
	const [revealedValue, setRevealedValue] = useState<string | null>(null)
	const [isRevealing, setIsRevealing] = useState(false)

	async function getDecryptedValue() {
		const response = await fetch(`/api/projects/${projectId}/env?reveal=true`)
		const payload = (await response.json()) as { variables: EnvVariableSummary[] }
		const current = payload.variables.find((item) => item._id === variable._id)

		return current?.value || ''
	}

	async function copyValue(format: 'key' | 'value' | 'pair') {
		const value = await getDecryptedValue()
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

	async function toggleReveal() {
		if (revealedValue !== null) {
			setRevealedValue(null)
			return
		}

		setIsRevealing(true)
		setRevealedValue(await getDecryptedValue())
		setIsRevealing(false)
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
			<td className='max-w-[220px] truncate px-3 py-3 font-mono text-sm text-zinc-600'>
				{revealedValue ?? '••••••••'}
			</td>
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
					<IconAction
						label={revealedValue === null ? 'Reveal value' : 'Hide value'}
						onClick={toggleReveal}
						disabled={isRevealing}
					>
						{revealedValue === null ? (
							<Eye className='h-4 w-4' />
						) : (
							<EyeOff className='h-4 w-4' />
						)}
					</IconAction>
					<IconAction
						label={copied === 'key' ? 'Copied key' : 'Copy key'}
						onClick={() => copyValue('key')}
					>
						<Clipboard className='h-4 w-4' />
					</IconAction>
					<IconAction
						label={copied === 'value' ? 'Copied value' : 'Copy value'}
						onClick={() => copyValue('value')}
					>
						<Copy className='h-4 w-4' />
					</IconAction>
					<IconAction
						label={copied === 'pair' ? 'Copied KEY=VALUE' : 'Copy KEY=VALUE'}
						onClick={() => copyValue('pair')}
					>
						<FileCode2 className='h-4 w-4' />
					</IconAction>
					<IconAction label='Delete variable' onClick={deleteVariable} tone='danger'>
						<Trash2 className='h-4 w-4' />
					</IconAction>
				</div>
			</td>
		</tr>
	)
}

function IconAction({
	children,
	label,
	onClick,
	tone = 'default',
	disabled = false,
}: {
	children: React.ReactNode
	label: string
	onClick: () => void
	tone?: 'default' | 'danger'
	disabled?: boolean
}) {
	return (
		<button
			type='button'
			onClick={onClick}
			disabled={disabled}
			title={label}
			aria-label={label}
			className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition ${
				tone === 'danger'
					? 'border-red-200 text-red-700 hover:bg-red-50'
					: 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
			} disabled:cursor-not-allowed disabled:opacity-50`}
		>
			{children}
		</button>
	)
}
