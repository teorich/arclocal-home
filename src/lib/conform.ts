const MAX_STRING = 2000
const MAX_ITEMS = 24

/**
 * Shapes `input` after `template` (the default content): unknown keys are
 * dropped, wrong types fall back to the default, strings are length-capped and
 * lists are capped and normalised item by item. Missing fields take the
 * template's value, so adding a field to the defaults never breaks old data.
 */
export function conform<T>(template: T, input: unknown): T {
  if (typeof template === 'string') {
    return (typeof input === 'string' ? input.slice(0, MAX_STRING) : template) as T
  }
  if (typeof template === 'number') {
    return (typeof input === 'number' && Number.isFinite(input) ? input : template) as T
  }
  if (Array.isArray(template)) {
    if (!Array.isArray(input)) return template
    const itemTemplate = template[0]
    if (itemTemplate === undefined) return [] as T
    return input.slice(0, MAX_ITEMS).map((item) => conform(itemTemplate, item)) as T
  }
  if (template && typeof template === 'object') {
    const source = input && typeof input === 'object' && !Array.isArray(input) ? (input as Record<string, unknown>) : {}
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(template)) {
      out[key] = conform((template as Record<string, unknown>)[key], source[key])
    }
    return out as T
  }
  return template
}

/** An empty copy of `template` (strings → "", numbers → 0), used for "add item". */
export function blank<T>(template: T): T {
  if (typeof template === 'string') return '' as T
  if (typeof template === 'number') return 0 as T
  if (Array.isArray(template)) return [] as T
  if (template && typeof template === 'object') {
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(template)) out[key] = blank((template as Record<string, unknown>)[key])
    return out as T
  }
  return template
}
