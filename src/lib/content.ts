import { conform } from './conform'
import { homeSeed, type HomeContent } from './home-content'
import { deleteBlock, readBlock, writeBlock } from './db'

const HOME_KEY = 'home'

/**
 * Content for the public page. Never throws: if the CMS database is
 * unavailable the page falls back to the default copy instead of going down.
 */
export function getHomeContent(): HomeContent {
  try {
    return conform(homeSeed, readBlock(HOME_KEY)?.value)
  } catch (error) {
    console.error('[cms] Could not read home content, using defaults:', error)
    return homeSeed
  }
}

/** Content plus metadata for the editor. Throws on storage errors (visible in the UI). */
export function getHomeContentForEditor() {
  const stored = readBlock(HOME_KEY)
  return { value: conform(homeSeed, stored?.value), updatedAt: stored?.updatedAt ?? null }
}

export function saveHomeContent(input: unknown) {
  const value = conform(homeSeed, input)
  const updatedAt = writeBlock(HOME_KEY, value)
  return { value, updatedAt }
}

export function resetHomeContent() {
  deleteBlock(HOME_KEY)
  return { value: homeSeed, updatedAt: null }
}
