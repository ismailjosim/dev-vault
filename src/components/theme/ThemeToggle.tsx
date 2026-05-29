'use client'

import { Laptop, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

const themeOptions = [
	{ value: 'light', label: 'Light', icon: Sun },
	{ value: 'dark', label: 'Dark', icon: Moon },
	{ value: 'system', label: 'System', icon: Laptop },
]

export function ThemeToggle() {
	const mounted = useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	)
	const { theme, setTheme } = useTheme()

	if (!mounted) {
		return (
			<div className='border-border bg-secondary h-9 w-29 rounded-md border' />
		)
	}

	return (
		<div className='border-border bg-card inline-flex rounded-md border p-1'>
			{themeOptions.map((option) => {
				const Icon = option.icon
				const isActive = theme === option.value

				return (
					<button
						key={option.value}
						type='button'
						onClick={() => setTheme(option.value)}
						title={`${option.label} theme`}
						aria-label={`${option.label} theme`}
						className={`inline-flex h-7 w-9 items-center justify-center rounded transition ${
							isActive
								? 'bg-primary text-primary-foreground'
								: 'text-muted-foreground hover:bg-hover hover:text-foreground'
						}`}
					>
						<Icon className='h-4 w-4' />
					</button>
				)
			})}
		</div>
	)
}
