import { redirect } from 'next/navigation'
import HomeEditor from '@/components/admin/HomeEditor'
import { getHomeContentForEditor } from '@/lib/content'
import { hasSession } from '@/lib/require-session'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  // proxy.ts already redirects anonymous visitors; this is the second lock.
  if (!(await hasSession())) redirect('/admin/login')
  return <HomeEditor initial={getHomeContentForEditor()} />
}
