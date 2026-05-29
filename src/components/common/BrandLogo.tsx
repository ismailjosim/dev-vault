import Image from 'next/image'
import Link from 'next/link'

type BrandLogoProps = {
	href?: string
	size?: 'sm' | 'md' | 'lg'
}

const sizes = {
	sm: {
		icon: 28,
		text: 'text-lg',
		gap: 'gap-2',
	},
	md: {
		icon: 40,
		text: 'text-3xl',
		gap: 'gap-3',
	},
	lg: {
		icon: 48,
		text: 'text-4xl',
		gap: 'gap-3',
	},
}

export function BrandLogo({ href, size = 'md' }: BrandLogoProps) {
	const current = sizes[size]
	const content = (
		<span
			className={`inline-flex items-center justify-center ${current.gap}`}
			aria-label='DevVault'
		>
			<Image
				src='/apple-touch-icon.png'
				alt=''
				width={current.icon}
				height={current.icon}
				priority
				className='shrink-0 rounded-md'
			/>
			<span className={`text-foreground font-bold ${current.text}`}>
				DevVault
			</span>
		</span>
	)

	if (!href) return content

	return (
		<Link href={href} className='inline-flex rounded-md focus:outline-none'>
			{content}
		</Link>
	)
}
