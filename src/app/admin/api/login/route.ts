import { cookies } from 'next/headers'
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  clearFailures,
  clientKey,
  createSessionToken,
  isConfigured,
  isThrottled,
  recordFailure,
  verifyCredentials,
} from '@/lib/auth'

export async function POST(request: Request) {
  if (!isConfigured()) {
    console.error('[cms] CMS_ADMIN_EMAIL, CMS_ADMIN_PASSWORD and SESSION_SECRET must all be set.')
    return Response.json({ error: 'The CMS is not configured on this server.' }, { status: 503 })
  }

  const client = clientKey(request.headers)
  if (isThrottled(client)) {
    return Response.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!verifyCredentials(email, password)) {
    recordFailure(client)
    return Response.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  clearFailures(client)
  ;(await cookies()).set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return Response.json({ ok: true })
}
