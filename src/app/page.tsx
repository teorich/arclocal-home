import type { Metadata } from 'next'
import HomePage from '@/components/home/HomePage'
import { getHomeContent } from '@/lib/content'

// Content is edited in the CMS, so render per request instead of baking it in at build time.
export const dynamic = 'force-dynamic'

export function generateMetadata(): Metadata {
  const { seo } = getHomeContent()
  return {
    title: seo.title,
    description: seo.description,
    openGraph: { title: seo.title, description: seo.socialDescription, siteName: 'ArcLocal', type: 'website' },
  }
}

export default function Page() {
  return <HomePage content={getHomeContent()} />
}
