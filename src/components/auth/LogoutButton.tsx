'use client'

import { signOut } from '@/lib/auth-client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LogoutButton() {
	const router = useRouter()
	const [isSigningOut, setIsSigningOut] = useState(false)

	const handleLogout = async () => {
		setIsSigningOut(true)

		await signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push('/auth/login')
					router.refresh()
				},
			},
		})

		setIsSigningOut(false)
	}

	return (
		<button
			type='button'
			onClick={handleLogout}
			disabled={isSigningOut}
			title='Log out'
			aria-label='Log out'
			className='border-border bg-card text-foreground hover:bg-hover inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50'
		>
			<LogOut className='h-4 w-4' />
			<span>{isSigningOut ? 'Logging out...' : 'Log out'}</span>
		</button>
	)
}
