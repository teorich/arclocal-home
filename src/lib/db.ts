import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

declare global {
  var __arclocalCmsDb: Database.Database | undefined
}

/**
 * Where the CMS database lives. Defaults to `.data/cms.db` under the working
 * directory; in production point CMS_DB_PATH at a mounted volume (the
 * Dockerfile uses /data/cms.db) so content survives redeploys.
 */
function dbPath() {
  return process.env.CMS_DB_PATH || path.join(process.cwd(), '.data', 'cms.db')
}

function open(): Database.Database {
  const file = dbPath()
  mkdirSync(path.dirname(file), { recursive: true })
  const db = new Database(file)
  db.pragma('journal_mode = WAL')
  db.pragma('busy_timeout = 5000')
  db.exec(`
    CREATE TABLE IF NOT EXISTS content_blocks (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)
  return db
}

// Opened lazily (never at import/build time) and cached on globalThis so dev
// HMR doesn't leak file handles.
function getDb() {
  if (!globalThis.__arclocalCmsDb) globalThis.__arclocalCmsDb = open()
  return globalThis.__arclocalCmsDb
}

export type StoredBlock = { value: unknown; updatedAt: string }

export function readBlock(key: string): StoredBlock | undefined {
  const row = getDb()
    .prepare('SELECT value, updated_at FROM content_blocks WHERE key = ?')
    .get(key) as { value: string; updated_at: string } | undefined
  if (!row) return undefined
  try {
    return { value: JSON.parse(row.value), updatedAt: row.updated_at }
  } catch {
    return undefined
  }
}

export function writeBlock(key: string, value: unknown): string {
  const updatedAt = new Date().toISOString()
  getDb()
    .prepare(
      `INSERT INTO content_blocks (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    )
    .run(key, JSON.stringify(value), updatedAt)
  return updatedAt
}

export function deleteBlock(key: string) {
  getDb().prepare('DELETE FROM content_blocks WHERE key = ?').run(key)
}
