import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, isValidSessionToken } from '@/lib/auth'

// Everything the CMS owns lives under /admin (pages and API), so a single
// reverse-proxy rule — `/admin/*` → this app — is all deployment needs.
const PUBLIC_PATHS = new Set(['/admin/login', '/admin/api/login'])

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authed = isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value)

  if (pathname === '/admin/login' && authed) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  if (PUBLIC_PATHS.has(pathname) || authed) return NextResponse.next()

  if (pathname.startsWith('/admin/api/')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.redirect(new URL('/admin/login', request.url))
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
