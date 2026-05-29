import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

/**
 * Get the current session server-side
 * @returns Session data or null if not authenticated
 */
export async function getSession() {
	const headersList = await headers()
	const session = await auth.api.getSession({
		headers: headersList,
	})
	return session
}

/**
 * Check if user is authenticated
 * @returns True if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
	const session = await getSession()
	return !!session
}

/**
 * Get current user from session
 * @returns User data or null if not authenticated
 */
export async function getCurrentUser() {
	const session = await getSession()
	return session?.user || null
}
