import { getSessionCookie } from 'better-auth/cookies'
import { type NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/error']

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	const isPublicRoute = publicRoutes.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	)

	const sessionCookie = getSessionCookie(request)

	if (isPublicRoute) {
		return NextResponse.next()
	}

	if (!sessionCookie) {
		const loginUrl = new URL('/auth/login', request.url)
		loginUrl.searchParams.set('callbackUrl', pathname)
		return NextResponse.redirect(loginUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
