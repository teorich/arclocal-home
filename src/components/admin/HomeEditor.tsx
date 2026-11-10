'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { HomeContent } from '@/lib/home-content'
import { EditorContext, Group, Num, ObjectList, Section, StringList, Text, setIn, type Path } from './fields'

type Status = { kind: 'idle' } | { kind: 'saving' } | { kind: 'saved' } | { kind: 'error'; message: string }

const SECTIONS = [
  ['seo', 'Search & sharing'],
  ['topbar', 'Top bar'],
  ['header', 'Header'],
  ['hero', 'Hero'],
  ['benefits', 'Benefits strip'],
  ['platform', 'Platform'],
  ['how', 'How it works'],
  ['why', 'Why ArcLocal'],
  ['cta', 'Call to action'],
  ['footer', 'Footer'],
] as const

const buttonBase = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60'

function formatWhen(iso: string | null) {
  if (!iso) return 'Showing the default content'
  return `Last published ${new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}`
}

export default function HomeEditor({ initial }: { initial: { value: HomeContent; updatedAt: string | null } }) {
  const [draft, setDraft] = useState<HomeContent>(initial.value)
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(initial.value))
  const [updatedAt, setUpdatedAt] = useState(initial.updatedAt)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const dirty = useMemo(() => JSON.stringify(draft) !== savedJson, [draft, savedJson])
  const saving = status.kind === 'saving'

  const set = useCallback((path: Path, value: unknown) => {
    setDraft((current) => setIn(current, path, value))
    setStatus((s) => (s.kind === 'idle' ? s : { kind: 'idle' }))
  }, [])

  const adopt = (data: { value: HomeContent; updatedAt: string | null }) => {
    setDraft(data.value)
    setSavedJson(JSON.stringify(data.value))
    setUpdatedAt(data.updatedAt)
  }

  const request = async (method: 'PUT' | 'DELETE') => {
    setStatus({ kind: 'saving' })
    try {
      const res = await fetch('/admin/api/content', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'PUT' ? JSON.stringify({ value: draft }) : undefined,
      })
      if (res.status === 401) {
        window.location.assign('/admin/login')
        return
      }
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.value) throw new Error(data?.error ?? 'The server could not save your changes.')
      adopt(data)
      setStatus({ kind: 'saved' })
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Something went wrong.' })
    }
  }

  const save = () => {
    if (dirty && !saving) void request('PUT')
  }

  const reset = () => {
    if (saving) return
    if (window.confirm('Reset every field to the original ArcLocal content? This publishes the defaults to the live site.')) {
      void request('DELETE')
    }
  }

  const signOut = async () => {
    await fetch('/admin/api/logout', { method: 'POST' })
    window.location.assign('/admin/login')
  }

  // Warn before leaving with unsaved edits; Ctrl/Cmd+S saves.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault()
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  })
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        save()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const ctx = useMemo(() => ({ draft, set }), [draft, set])

  return (
    <EditorContext.Provider value={ctx}>
      <div className="min-h-screen bg-[#f5f9fe]">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3">
            <div className="min-w-0">
              <p className="text-lg font-extrabold tracking-tight text-[#12396a]">Arc<span className="text-[#54a832]">Local</span> <span className="font-semibold text-slate-400">CMS</span></p>
              <p className="text-xs text-slate-500">Home page · {formatWhen(updatedAt)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span role="status" aria-live="polite" className="mr-1 text-sm font-semibold">
                {status.kind === 'saving' && <span className="text-slate-500">Saving…</span>}
                {status.kind === 'saved' && !dirty && <span className="text-[#2f7620]">✓ Saved — live on the site</span>}
                {status.kind === 'error' && <span className="text-red-600">{status.message}</span>}
                {status.kind !== 'saving' && status.kind !== 'error' && dirty && <span className="text-amber-600">● Unsaved changes</span>}
              </span>
              <a href="/" target="_blank" rel="noopener noreferrer" className={`${buttonBase} border border-slate-300 bg-white text-[#12396a] hover:border-[#54a832]`}>View site ↗</a>
              <button type="button" onClick={reset} disabled={saving} className={`${buttonBase} border border-slate-300 bg-white text-slate-600 hover:border-red-300 hover:text-red-600`}>Reset to defaults</button>
              <button type="button" onClick={signOut} className={`${buttonBase} border border-slate-300 bg-white text-slate-600 hover:border-slate-400`}>Sign out</button>
              <button type="button" onClick={save} disabled={!dirty || saving} className={`${buttonBase} bg-[#3f8526] text-white shadow-sm hover:bg-[#35711f]`}>{saving ? 'Saving…' : 'Save changes'}</button>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[200px_1fr]">
          <nav aria-label="Sections" className="hidden lg:block">
            <ul className="sticky top-28 space-y-1">
              {SECTIONS.map(([id, label]) => (
                <li key={id}><a href={`#${id}`} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-[#2f7620]">{label}</a></li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 space-y-6">
            <Section id="seo" title="Search & sharing" description="How the page appears in browser tabs, Google results and link previews.">
              <Text path={['seo', 'title']} label="Page title" hint="Shown in the browser tab and search results — aim for under 60 characters." />
              <Text path={['seo', 'description']} label="Search description" multiline hint="Shown under the title in search results — aim for under 160 characters." />
              <Text path={['seo', 'socialDescription']} label="Link-preview description" multiline hint="Shown when the page is shared on WhatsApp, LinkedIn, etc." />
            </Section>

            <Section id="topbar" title="Top bar" description="The dark strip above the header.">
              <Text path={['topbar', 'left']} label="Left text" />
              <Text path={['topbar', 'center']} label="Second text" hint="Hidden on small phones." />
              <Text path={['topbar', 'right']} label="Right text" hint="Only visible on larger screens." />
              <Text path={['topbar', 'signIn']} label="Sign-in link label" />
            </Section>

            <Section id="header" title="Header" description="Logo tagline and the two header buttons. Menu items and where buttons link to are fixed.">
              <Text path={['header', 'tagline']} label="Logo tagline" hint="Displays in capital letters under the ArcLocal logo." />
              <Text path={['header', 'login']} label="Log-in link label" />
              <Text path={['header', 'cta']} label="Primary button label" />
            </Section>

            <Section id="hero" title="Hero" description="The first thing visitors see.">
              <Text path={['hero', 'badge']} label="Badge" />
              <div className="grid gap-5 sm:grid-cols-2">
                <Text path={['hero', 'headlineStart']} label="Headline" hint="The first, dark part of the headline." />
                <Text path={['hero', 'headlineAccent']} label="Headline highlight" hint="Shown in green, right after the headline." />
              </div>
              <Text path={['hero', 'body']} label="Intro paragraph" multiline />
              <div className="grid gap-5 sm:grid-cols-2">
                <Text path={['hero', 'primaryCta']} label="Primary button" />
                <Text path={['hero', 'secondaryCta']} label="Secondary button" />
              </div>
              <StringList path={['hero', 'checks']} label="Checkmark points" itemName="Point" />
              <Group title="Dashboard illustration">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Text path={['hero', 'visual', 'campaignLabel']} label="Small label" />
                  <Text path={['hero', 'visual', 'campaignTitle']} label="Title" />
                  <Text path={['hero', 'visual', 'liveBadge']} label="Status badge" />
                  <Text path={['hero', 'visual', 'reachLabel']} label="Reach card label" />
                  <Text path={['hero', 'visual', 'reachValue']} label="Reach number" />
                  <Num path={['hero', 'visual', 'reachPercent']} label="Delivered %" min={0} max={100} hint="Sets the progress bar (0–100)." />
                  <Text path={['hero', 'visual', 'reachCaption']} label="Text after the %" hint="Reads as “82% delivered”." />
                  <Text path={['hero', 'visual', 'receiptTitle']} label="Receipt card title" />
                </div>
                <Text path={['hero', 'visual', 'receiptText']} label="Receipt card text" multiline />
              </Group>
            </Section>

            <Section id="benefits" title="Benefits strip" description="The four short highlights directly under the hero. Icons follow the order.">
              <ObjectList path={['benefits']} label="Benefits" itemName="Benefit" fields={[{ key: 'title', label: 'Title' }, { key: 'text', label: 'Short text' }]} />
            </Section>

            <Section id="platform" title="Platform" description="The feature cards section.">
              <Text path={['platform', 'eyebrow']} label="Small heading" />
              <Text path={['platform', 'title']} label="Title" />
              <Text path={['platform', 'body']} label="Intro paragraph" multiline />
              <Text path={['platform', 'cardLink']} label="Card link label" hint="Shown at the bottom of every card." />
              <ObjectList path={['platform', 'items']} label="Feature cards" itemName="Card" fields={[{ key: 'title', label: 'Title' }, { key: 'text', label: 'Description', multiline: true }]} />
            </Section>

            <Section id="how" title="How it works" description="The numbered steps. Numbers are added automatically.">
              <Text path={['how', 'eyebrow']} label="Small heading" />
              <Text path={['how', 'title']} label="Title" />
              <Text path={['how', 'body']} label="Intro paragraph" multiline />
              <Text path={['how', 'cta']} label="Button label" />
              <ObjectList path={['how', 'steps']} label="Steps" itemName="Step" fields={[{ key: 'title', label: 'Title' }, { key: 'text', label: 'Description', multiline: true }]} />
            </Section>

            <Section id="why" title="Why ArcLocal" description="The dark feature panel.">
              <Text path={['why', 'eyebrow']} label="Small heading" />
              <Text path={['why', 'title']} label="Title" />
              <Text path={['why', 'body']} label="Intro paragraph" multiline />
              <StringList path={['why', 'chips']} label="Tags" itemName="Tag" />
              <Group title="Status card">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Text path={['why', 'panel', 'title']} label="Title" />
                  <Text path={['why', 'panel', 'subtitle']} label="Subtitle" />
                  <Text path={['why', 'panel', 'status']} label="Status badge" />
                  <span aria-hidden className="hidden sm:block" />
                  <Text path={['why', 'panel', 'stat1Label']} label="First stat label" />
                  <Text path={['why', 'panel', 'stat1Value']} label="First stat value" />
                  <Text path={['why', 'panel', 'stat2Label']} label="Second stat label" />
                  <Text path={['why', 'panel', 'stat2Value']} label="Second stat value" />
                </div>
              </Group>
            </Section>

            <Section id="cta" title="Call to action" description="The closing section (it's what the “Pricing” menu item jumps to).">
              <Text path={['cta', 'eyebrow']} label="Small heading" />
              <Text path={['cta', 'title']} label="Title" />
              <Text path={['cta', 'body']} label="Intro paragraph" multiline />
              <div className="grid gap-5 sm:grid-cols-2">
                <Text path={['cta', 'primary']} label="Primary button" />
                <Text path={['cta', 'secondary']} label="Secondary button" />
              </div>
            </Section>

            <Section id="footer" title="Footer">
              <Text path={['footer', 'about']} label="About text" multiline />
              <Text path={['footer', 'opsTitle']} label="Right column heading" />
              <Text path={['footer', 'opsText']} label="Right column text" multiline />
              <Text path={['footer', 'copyright']} label="Copyright line" hint="Includes the year — update it each January." />
              <Text path={['footer', 'legal']} label="Legal line" />
            </Section>
          </div>
        </div>
      </div>
    </EditorContext.Provider>
  )
}

