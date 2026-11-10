'use client'

import { createContext, useContext, useId, type ReactNode } from 'react'
import { blank } from '@/lib/conform'
import { homeSeed, type HomeContent } from '@/lib/home-content'

export type Path = (string | number)[]
export const MAX_ITEMS = 24

export function getIn(obj: unknown, path: Path): unknown {
  return path.reduce<unknown>(
    (acc, key) => (acc == null ? undefined : (acc as Record<string | number, unknown>)[key]),
    obj,
  )
}

export function setIn<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T
  const [head, ...rest] = path
  const copy = (Array.isArray(obj) ? [...obj] : { ...(obj as object) }) as Record<string | number, unknown>
  copy[head] = setIn((obj as Record<string | number, unknown>)[head], rest, value)
  return copy as T
}

type EditorContextValue = { draft: HomeContent; set: (path: Path, value: unknown) => void }
export const EditorContext = createContext<EditorContextValue | null>(null)

function useEditor() {
  const ctx = useContext(EditorContext)
  if (!ctx) throw new Error('Field used outside of EditorContext')
  return ctx
}

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#102b54] placeholder:text-slate-400 transition focus:border-[#54a832]'
const labelClass = 'block text-sm font-semibold text-[#12396a]'
const hintClass = 'mt-1 text-xs leading-5 text-slate-500'
const iconButton =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-[#54a832] hover:text-[#2f7620] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600'

export function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-extrabold text-[#12396a]">{title}</h2>
      {description && <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  )
}

export function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-5 rounded-xl border border-slate-100 bg-[#f8fbfd] p-5">
      <legend className="px-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{title}</legend>
      {children}
    </fieldset>
  )
}

export function Text({ path, label, hint, multiline = false }: { path: Path; label: string; hint?: string; multiline?: boolean }) {
  const { draft, set } = useEditor()
  const id = useId()
  const value = String(getIn(draft, path) ?? '')
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      {multiline ? (
        <textarea id={id} rows={3} value={value} onChange={(e) => set(path, e.target.value)} className={`${inputClass} mt-1.5 resize-y`} />
      ) : (
        <input id={id} type="text" value={value} onChange={(e) => set(path, e.target.value)} className={`${inputClass} mt-1.5`} />
      )}
      {hint && <p className={hintClass}>{hint}</p>}
    </div>
  )
}

export function Num({ path, label, hint, min, max }: { path: Path; label: string; hint?: string; min?: number; max?: number }) {
  const { draft, set } = useEditor()
  const id = useId()
  const value = Number(getIn(draft, path) ?? 0)
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => set(path, e.target.value === '' ? 0 : Number(e.target.value))}
        className={`${inputClass} mt-1.5 sm:max-w-40`}
      />
      {hint && <p className={hintClass}>{hint}</p>}
    </div>
  )
}

function moveItem<T>(list: T[], from: number, to: number) {
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function ItemControls({ index, count, name, onMove, onRemove }: { index: number; count: number; name: string; onMove: (to: number) => void; onRemove: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button type="button" className={iconButton} disabled={index === 0} onClick={() => onMove(index - 1)} aria-label={`Move ${name} up`} title="Move up">↑</button>
      <button type="button" className={iconButton} disabled={index === count - 1} onClick={() => onMove(index + 1)} aria-label={`Move ${name} down`} title="Move down">↓</button>
      <button type="button" className={`${iconButton} hover:!border-red-300 hover:!text-red-600`} onClick={onRemove} aria-label={`Remove ${name}`} title="Remove">✕</button>
    </div>
  )
}

function AddButton({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-[#54a832] hover:text-[#2f7620] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span aria-hidden>＋</span> {disabled ? `Limit of ${MAX_ITEMS} reached` : label}
    </button>
  )
}

/** A list of short strings (chips, checkmarks). */
export function StringList({ path, label, itemName, hint }: { path: Path; label: string; itemName: string; hint?: string }) {
  const { draft, set } = useEditor()
  const items = (getIn(draft, path) as string[]) ?? []
  return (
    <div>
      <p className={labelClass}>{label}</p>
      {hint && <p className={hintClass}>{hint}</p>}
      <ul className="mt-2 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              aria-label={`${itemName} ${i + 1}`}
              onChange={(e) => set(path, items.map((x, j) => (j === i ? e.target.value : x)))}
              className={inputClass}
            />
            <ItemControls index={i} count={items.length} name={`${itemName} ${i + 1}`} onMove={(to) => set(path, moveItem(items, i, to))} onRemove={() => set(path, items.filter((_, j) => j !== i))} />
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <AddButton label={`Add ${itemName.toLowerCase()}`} disabled={items.length >= MAX_ITEMS} onClick={() => set(path, [...items, ''])} />
      </div>
    </div>
  )
}

type FieldSpec = { key: string; label: string; multiline?: boolean }

/** A list of cards, each with the given fields (benefits, steps, capabilities…). */
export function ObjectList({ path, label, itemName, fields, hint }: { path: Path; label: string; itemName: string; fields: FieldSpec[]; hint?: string }) {
  const { draft, set } = useEditor()
  const items = (getIn(draft, path) as Record<string, string>[]) ?? []
  const template = (getIn(homeSeed, path) as Record<string, unknown>[])[0]
  return (
    <div>
      <p className={labelClass}>{label}</p>
      {hint && <p className={hintClass}>{hint}</p>}
      <ol className="mt-3 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="rounded-xl border border-slate-200 bg-[#f8fbfd] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{itemName} {i + 1}</p>
              <ItemControls index={i} count={items.length} name={`${itemName} ${i + 1}`} onMove={(to) => set(path, moveItem(items, i, to))} onRemove={() => set(path, items.filter((_, j) => j !== i))} />
            </div>
            <div className="space-y-4">
              {fields.map((f) => (
                <Text key={f.key} path={[...path, i, f.key]} label={f.label} multiline={f.multiline} />
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-3">
        <AddButton label={`Add ${itemName.toLowerCase()}`} disabled={items.length >= MAX_ITEMS} onClick={() => set(path, [...items, blank(template)])} />
      </div>
    </div>
  )
}
