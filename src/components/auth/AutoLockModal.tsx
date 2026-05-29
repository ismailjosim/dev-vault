'use client'

import { signOut } from '@/lib/auth-client'
import { useAutoLock } from '@/hooks/useAutoLock'
import { LockKeyhole } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export function AutoLockModal() {
	const pathname = usePathname()
	const router = useRouter()
	const shouldWatch = pathname.startsWith('/dashboard')
	const { isLocked, resetLock } = useAutoLock(shouldWatch ? 15 : 0)

	async function lockNow() {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push('/auth/login')
					router.refresh()
				},
			},
		})
	}

	if (!shouldWatch || !isLocked) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4'>
			<div className='border-border bg-card text-card-foreground w-full max-w-sm rounded-lg border p-6 shadow-2xl'>
				<div className='flex items-center gap-3'>
					<div className='bg-secondary text-secondary-foreground rounded-md p-2'>
						<LockKeyhole className='h-5 w-5' />
					</div>
					<div>
						<h2 className='text-base font-semibold'>Session idle</h2>
						<p className='text-muted-foreground mt-1 text-sm'>
							Continue working or lock DevVault and sign in again.
						</p>
					</div>
				</div>

				<div className='mt-5 flex justify-end gap-2'>
					<button
						type='button'
						onClick={lockNow}
						className='border-border text-foreground hover:bg-hover rounded-md border px-4 py-2 text-sm'
					>
						Lock
					</button>
					<button
						type='button'
						onClick={resetLock}
						className='bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-semibold'
					>
						Continue
					</button>
				</div>
			</div>
		</div>
	)
}
