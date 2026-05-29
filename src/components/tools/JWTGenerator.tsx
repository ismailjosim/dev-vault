'use client'

import { generateJWTSecret } from '@/utils/generators'
import { Copy, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export function JWTGenerator() {
	const [length, setLength] = useState(64)
	const [accessSecret, setAccessSecret] = useState(() => generateJWTSecret(64))
	const [refreshSecret, setRefreshSecret] = useState(() =>
		generateJWTSecret(64),
	)
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
			<section className='border-border bg-card rounded-lg border p-5'>
				<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<h2 className='text-card-foreground text-base font-semibold'>
							JWT secrets
						</h2>
						<p className='text-muted-foreground mt-1 text-sm'>
							Strength: {length >= 64 ? 'Strong' : 'Needs 64+ characters'}
						</p>
					</div>
					<div className='flex gap-2'>
						<button
							type='button'
							onClick={() => copy('formatted', formatted)}
							className='border-border text-foreground hover:bg-hover inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm'
						>
							<Copy className='h-4 w-4' />
							{copied === 'formatted' ? 'Copied' : 'Copy .env'}
						</button>
						<button
							type='button'
							onClick={generateBoth}
							className='bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:opacity-90'
						>
							<RefreshCw className='h-4 w-4' />
							Generate both
						</button>
					</div>
				</div>

				<label className='mt-5 block max-w-sm'>
					<span className='text-muted-foreground text-sm'>
						Length: {length}
					</span>
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
		<section className='border-border bg-card rounded-lg border p-5'>
			<div className='flex items-center justify-between gap-3'>
				<h3 className='text-card-foreground text-sm font-medium'>{label}</h3>
				<div className='flex gap-2'>
					<button
						type='button'
						onClick={onCopy}
						className='border-border text-foreground hover:bg-hover inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm'
					>
						<Copy className='h-4 w-4' />
						{copied ? 'Copied' : 'Copy'}
					</button>
					<button
						type='button'
						onClick={onRegenerate}
						className='border-border text-foreground hover:bg-hover inline-flex h-9 items-center justify-center rounded-md border px-3'
						title='Regenerate'
						aria-label='Regenerate'
					>
						<RefreshCw className='h-4 w-4' />
					</button>
				</div>
			</div>
			<div className='border-border bg-background text-foreground mt-3 overflow-x-auto rounded-md border p-4 font-mono text-xs'>
				{value}
			</div>
		</section>
	)
}
