'use client'

import { generatePassword, PasswordOptions } from '@/utils/generators'
import { Copy, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'

const defaultOptions: PasswordOptions = {
	length: 20,
	uppercase: true,
	lowercase: true,
	numbers: true,
	symbols: true,
	excludeConfusing: true,
}

export function PasswordGenerator() {
	const [options, setOptions] = useState<PasswordOptions>(defaultOptions)
	const [password, setPassword] = useState(() => generatePassword(defaultOptions))
	const [history, setHistory] = useState<string[]>([])
	const [copied, setCopied] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const strength = useMemo(() => {
		const enabledTypes = [
			options.uppercase,
			options.lowercase,
			options.numbers,
			options.symbols,
		].filter(Boolean).length
		const score = options.length + enabledTypes * 6
		if (score >= 42) return 'Strong'
		if (score >= 28) return 'Good'
		return 'Weak'
	}, [options])

	function updateOption<K extends keyof PasswordOptions>(
		key: K,
		value: PasswordOptions[K],
	) {
		setOptions((current) => ({ ...current, [key]: value }))
		setError(null)
	}

	function generateNext() {
		try {
			const nextPassword = generatePassword(options)
			setHistory((current) => [password, ...current].filter(Boolean).slice(0, 5))
			setPassword(nextPassword)
			setError(null)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Could not generate password')
		}
	}

	async function copyPassword(value = password) {
		await navigator.clipboard.writeText(value)
		setCopied(true)
		window.setTimeout(() => setCopied(false), 1500)
	}

	return (
		<div className='grid gap-6 lg:grid-cols-[1fr_320px]'>
			<section className='rounded-lg border border-border bg-card p-5'>
				<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<h2 className='text-base font-semibold text-card-foreground'>
							Generated password
						</h2>
						<p className='mt-1 text-sm text-muted-foreground'>
							Strength: {strength}
						</p>
					</div>
					<div className='flex gap-2'>
						<button
							type='button'
							onClick={() => copyPassword()}
							className='inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-hover'
						>
							<Copy className='h-4 w-4' />
							{copied ? 'Copied' : 'Copy'}
						</button>
						<button
							type='button'
							onClick={generateNext}
							className='inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90'
						>
							<RefreshCw className='h-4 w-4' />
							Generate
						</button>
					</div>
				</div>

				<div className='mt-5 overflow-x-auto rounded-md border border-border bg-background p-4 font-mono text-sm text-foreground'>
					{password}
				</div>

				{error && <p className='mt-3 text-sm text-danger'>{error}</p>}

				{history.length > 0 && (
					<div className='mt-6'>
						<h3 className='text-sm font-medium text-foreground'>Session history</h3>
						<div className='mt-2 space-y-2'>
							{history.map((item) => (
								<button
									key={item}
									type='button'
									onClick={() => copyPassword(item)}
									className='block w-full truncate rounded-md border border-border px-3 py-2 text-left font-mono text-xs text-muted-foreground hover:bg-hover hover:text-foreground'
								>
									{item}
								</button>
							))}
						</div>
					</div>
				)}
			</section>

			<section className='rounded-lg border border-border bg-card p-5'>
				<h2 className='text-base font-semibold text-card-foreground'>Options</h2>
				<label className='mt-4 block'>
					<span className='text-sm text-muted-foreground'>Length: {options.length}</span>
					<input
						type='range'
						min='8'
						max='32'
						value={options.length}
						onChange={(event) => updateOption('length', Number(event.target.value))}
						className='mt-2 w-full'
					/>
				</label>

				<div className='mt-4 space-y-3'>
					<OptionToggle label='Uppercase' checked={options.uppercase} onChange={(value) => updateOption('uppercase', value)} />
					<OptionToggle label='Lowercase' checked={options.lowercase} onChange={(value) => updateOption('lowercase', value)} />
					<OptionToggle label='Numbers' checked={options.numbers} onChange={(value) => updateOption('numbers', value)} />
					<OptionToggle label='Symbols' checked={options.symbols} onChange={(value) => updateOption('symbols', value)} />
					<OptionToggle label='Exclude confusing chars' checked={options.excludeConfusing} onChange={(value) => updateOption('excludeConfusing', value)} />
				</div>
			</section>
		</div>
	)
}

function OptionToggle({
	label,
	checked,
	onChange,
}: {
	label: string
	checked: boolean
	onChange: (checked: boolean) => void
}) {
	return (
		<label className='flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm text-foreground'>
			{label}
			<input
				type='checkbox'
				checked={checked}
				onChange={(event) => onChange(event.target.checked)}
				className='h-4 w-4'
			/>
		</label>
	)
}
