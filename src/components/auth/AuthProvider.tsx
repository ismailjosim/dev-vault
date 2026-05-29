'use client'

import { authClient } from '@/lib/auth-client'
import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
	isAuthenticated: boolean
	isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [authState, setAuthState] = useState<AuthContextType>({
		isAuthenticated: false,
		isLoading: true,
	})

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch('/api/auth/session')
				const session = await response.json()
				setAuthState({
					isAuthenticated: !!session,
					isLoading: false,
				})
			} catch (error) {
				console.error('Auth check failed:', error)
				setAuthState({
					isAuthenticated: false,
					isLoading: false,
				})
			}
		}

		checkAuth()
	}, [])

	return (
		<AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within AuthProvider')
	}
	return context
}
