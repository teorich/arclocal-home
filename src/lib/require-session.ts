import { cookies } from 'next/headers'
import { SESSION_COOKIE, isValidSessionToken } from './auth'

/** Route-handler guard (defence in depth: proxy.ts already blocks unauthenticated requests). */
export async function hasSession() {
  return isValidSessionToken((await cookies()).get(SESSION_COOKIE)?.value)
}

export const unauthorized = () => Response.json({ error: 'Unauthorized' }, { status: 401 })
