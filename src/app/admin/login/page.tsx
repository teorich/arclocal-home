'use client'

import { useState, type FormEvent } from 'react'

const inputClass =
  'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-[#102b54] placeholder:text-slate-400 transition focus:border-[#54a832]'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/admin/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        window.location.assign('/admin')
        return
      }
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Could not sign in. Please try again.')
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#062f66] px-5 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-center text-2xl font-extrabold tracking-tight text-[#12396a]">Arc<span className="text-[#54a832]">Local</span></p>
        <p className="mt-1 text-center text-xs font-bold uppercase tracking-[0.17em] text-slate-400">Content manager</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[#12396a]">Email</label>
            <input id="email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-[#12396a]">Password</label>
            <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          </div>
          {error && <p role="alert" className="text-sm font-semibold text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full rounded-xl bg-[#3f8526] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#35711f] disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
