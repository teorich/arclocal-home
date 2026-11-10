import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

export const SESSION_COOKIE = 'arclocal_cms_session'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days

/** The three variables the CMS needs. Missing ones disable login entirely. */
export function isConfigured() {
  return Boolean(process.env.CMS_ADMIN_EMAIL && process.env.CMS_ADMIN_PASSWORD && process.env.SESSION_SECRET)
}

function sign(payload: string) {
  return createHmac('sha256', process.env.SESSION_SECRET as string).update(payload).digest('hex')
}

export function createSessionToken() {
  const payload = String(Date.now())
  return `${payload}.${sign(payload)}`
}

export function isValidSessionToken(token: string | undefined | null) {
  if (!token || !process.env.SESSION_SECRET) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false

  const expected = Buffer.from(sign(payload))
  const given = Buffer.from(signature)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false

  const issuedAt = Number(payload)
  return Number.isFinite(issuedAt) && Date.now() - issuedAt < SESSION_MAX_AGE_SECONDS * 1000
}

// Constant-time comparison independent of input length.
function safeEqual(a: string, b: string) {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export function verifyCredentials(email: string, password: string) {
  if (!isConfigured()) return false
  const emailOk = safeEqual(email.trim().toLowerCase(), (process.env.CMS_ADMIN_EMAIL as string).trim().toLowerCase())
  const passwordOk = safeEqual(password, process.env.CMS_ADMIN_PASSWORD as string)
  return emailOk && passwordOk
}

// --- Login throttling (in-memory, per process) ------------------------------
// Slows password guessing on the public login endpoint: 8 failures per client
// per 10 minutes. Resets on restart, which is acceptable for a single instance.
const WINDOW_MS = 10 * 60 * 1000
const MAX_FAILURES = 8
const failures = new Map<string, number[]>()

export function clientKey(headers: Headers) {
  return (
    headers.get('cf-connecting-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}

function recent(key: string) {
  const now = Date.now()
  const list = (failures.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (list.length) failures.set(key, list)
  else failures.delete(key)
  return list
}

export function isThrottled(key: string) {
  return recent(key).length >= MAX_FAILURES
}

export function recordFailure(key: string) {
  failures.set(key, [...recent(key), Date.now()])
}

export function clearFailures(key: string) {
  failures.delete(key)
}
