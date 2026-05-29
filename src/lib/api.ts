import { getCurrentUser } from '@/lib/session'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function requireUserId() {
	const user = await getCurrentUser()

	if (!user?.id) {
		return {
			userId: null,
			response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
		}
	}

	return { userId: user.id, response: null }
}

export function handleApiError(error: unknown) {
	if (error instanceof ZodError) {
		return NextResponse.json(
			{ message: 'Validation failed', errors: error.flatten().fieldErrors },
			{ status: 400 },
		)
	}

	if (error instanceof Error && 'code' in error && error.code === 11000) {
		return NextResponse.json(
			{ message: 'A matching record already exists' },
			{ status: 409 },
		)
	}

	console.error('API error:', error)
	return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
}

export function serializeDocument<T>(document: unknown): T {
	return JSON.parse(JSON.stringify(document)) as T
}
