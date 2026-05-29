import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Public routes that don't require authentication
	const publicRoutes = ['/auth/login', '/auth/signup', '/auth/error', '/']

	// Check if current path is public
	const isPublicRoute = publicRoutes.includes(pathname)

	if (!isPublicRoute) {
		// Check for session cookie
		const sessionCookie = request.cookies.get('better-auth.session_token')

		// If no session cookie and not a public route, redirect to login
		if (!sessionCookie) {
			return NextResponse.redirect(new URL('/auth/login', request.url))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
}
