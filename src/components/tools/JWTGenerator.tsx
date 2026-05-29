'use client'

import { generateJWTSecret } from '@/utils/generators'
import { Copy, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export function JWTGenerator() {
	const [length, setLength] = useState(64)
	const [accessSecret, setAccessSecret] = useState(() => generateJWTSecret(64))
	const [refreshSecret, setRefreshSecret] = useState(() => generateJWTSecret(64))
	const [copied, setCopied] = useState<string | null>(null)

	function generateBoth() {
		setAccessSecret(generateJWTSecret(length))
		setRefreshSecret(generateJWTSecret(length))
	}

	async function copy(label: string, value: string) {
		await navigator.clipboard.writeText(value)
		setCopied(label)
		window.setTimeout(() => setCopied(null), 1500)
	}

	const formatted = `JWT_ACCESS_SECRET=${accessSecret}\nJWT_REFRESH_SECRET=${refreshSecret}`

	return (
		<div className='space-y-6'>
			<section className='rounded-lg border border-border bg-card p-5'>
				<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<h2 className='text-base font-semibold text-card-foreground'>
							JWT secrets
						</h2>
						<p className='mt-1 text-sm text-muted-foreground'>
							Strength: {length >= 64 ? 'Strong' : 'Needs 64+ characters'}
						</p>
					</div>
					<div className='flex gap-2'>
						<button
							type='button'
							onClick={() => copy('formatted', formatted)}
							className='inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-hover'
						>
							<Copy className='h-4 w-4' />
							{copied === 'formatted' ? 'Copied' : 'Copy .env'}
						</button>
						<button
							type='button'
							onClick={generateBoth}
							className='inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90'
						>
							<RefreshCw className='h-4 w-4' />
							Generate both
						</button>
					</div>
				</div>

				<label className='mt-5 block max-w-sm'>
					<span className='text-sm text-muted-foreground'>Length: {length}</span>
					<input
						type='range'
						min='64'
						max='128'
						value={length}
						onChange={(event) => setLength(Number(event.target.value))}
						className='mt-2 w-full'
					/>
				</label>
			</section>

			<SecretBlock
				label='JWT_ACCESS_SECRET'
				value={accessSecret}
				copied={copied === 'access'}
				onCopy={() => copy('access', accessSecret)}
				onRegenerate={() => setAccessSecret(generateJWTSecret(length))}
			/>
			<SecretBlock
				label='JWT_REFRESH_SECRET'
				value={refreshSecret}
				copied={copied === 'refresh'}
				onCopy={() => copy('refresh', refreshSecret)}
				onRegenerate={() => setRefreshSecret(generateJWTSecret(length))}
			/>
		</div>
	)
}

function SecretBlock({
	label,
	value,
	copied,
	onCopy,
	onRegenerate,
}: {
	label: string
	value: string
	copied: boolean
	onCopy: () => void
	onRegenerate: () => void
}) {
	return (
		<section className='rounded-lg border border-border bg-card p-5'>
			<div className='flex items-center justify-between gap-3'>
				<h3 className='text-sm font-medium text-card-foreground'>{label}</h3>
				<div className='flex gap-2'>
					<button
						type='button'
						onClick={onCopy}
						className='inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-foreground hover:bg-hover'
					>
						<Copy className='h-4 w-4' />
						{copied ? 'Copied' : 'Copy'}
					</button>
					<button
						type='button'
						onClick={onRegenerate}
						className='inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-foreground hover:bg-hover'
						title='Regenerate'
						aria-label='Regenerate'
					>
						<RefreshCw className='h-4 w-4' />
					</button>
				</div>
			</div>
			<div className='mt-3 overflow-x-auto rounded-md border border-border bg-background p-4 font-mono text-xs text-foreground'>
				{value}
			</div>
		</section>
	)
}
