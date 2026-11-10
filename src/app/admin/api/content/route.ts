import { getHomeContentForEditor, resetHomeContent, saveHomeContent } from '@/lib/content'
import { hasSession, unauthorized } from '@/lib/require-session'

const MAX_BODY_BYTES = 200_000

export async function GET() {
  if (!(await hasSession())) return unauthorized()
  return Response.json(getHomeContentForEditor())
}

export async function PUT(request: Request) {
  if (!(await hasSession())) return unauthorized()

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ error: 'Content is too large.' }, { status: 413 })
  }
  let body: { value?: unknown } | null = null
  try {
    body = JSON.parse(raw)
  } catch {
    // handled below
  }
  if (!body || typeof body !== 'object' || !('value' in body)) {
    return Response.json({ error: 'Request body must be { "value": ... }.' }, { status: 400 })
  }
  return Response.json(saveHomeContent(body.value))
}

export async function DELETE() {
  if (!(await hasSession())) return unauthorized()
  return Response.json(resetHomeContent())
}
