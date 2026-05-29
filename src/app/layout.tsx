import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AutoLockModal } from '@/components/auth/AutoLockModal'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'DevVault',
	description: 'Store and manage project environment variables',
	manifest: '/site.webmanifest',
	icons: {
		icon: [
			{ url: '/favicon.ico' },
			{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
		],
		apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className='flex min-h-full flex-col' suppressHydrationWarning>
				<ThemeProvider>
					{children}
					<AutoLockModal />
				</ThemeProvider>
			</body>
		</html>
	)
}
