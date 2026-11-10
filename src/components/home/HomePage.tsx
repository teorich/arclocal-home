'use client'

import { useEffect, useState } from 'react'
import type { HomeContent } from '@/lib/home-content'

// SSR-safe theme preference. Matches the original Vite behaviour: persists to
// localStorage under 'arclocal-theme', follows prefers-color-scheme on first
// visit, and toggles the `.dark` class on <html>. The window/localStorage
// reads run in a mount effect so Next.js server rendering never touches them.
function useArcLocalTheme() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const stored = localStorage.getItem('arclocal-theme')
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
    setDark(stored === 'dark' ? true : stored === 'light' ? false : prefersDark)
  }, [])
  useEffect(() => {
    localStorage.setItem('arclocal-theme', dark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  return [dark, setDark] as const
}

function SiteThemeToggle({ dark, setDark }: { dark: boolean; setDark: (value: boolean) => void }) {
  return <button className="site-theme-toggle" type="button" onClick={() => setDark(!dark)} aria-label={dark ? 'Use light mode' : 'Use dark mode'} title={dark ? 'Use light mode' : 'Use dark mode'}><Icon name={dark ? 'sun' : 'moon'} className="h-4 w-4" /><span>{dark ? 'Light' : 'Dark'}</span></button>
}

type IconName = 'alert' | 'arrow' | 'bars' | 'bell' | 'bolt' | 'calendar' | 'chart' | 'check' | 'chevron' | 'close' | 'contacts' | 'creditCard' | 'download' | 'globe' | 'home' | 'insights' | 'lock' | 'logout' | 'menu' | 'message' | 'moon' | 'more' | 'phone' | 'plus' | 'search' | 'send' | 'settings' | 'shield' | 'spark' | 'speed' | 'sun' | 'wallet'

function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const props = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }

  if (name === 'alert') return <svg {...props}><path d="M12 3 2.8 20h18.4L12 3Z" /><path d="M12 9v4M12 17h.01" /></svg>
  if (name === 'arrow') return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  if (name === 'bars') return <svg {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
  if (name === 'bell') return <svg {...props}><path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
  if (name === 'bolt') return <svg {...props}><path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" /></svg>
  if (name === 'calendar') return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
  if (name === 'chart') return <svg {...props}><path d="M4 19V9M10 19V5M16 19v-7M22 19v-3M2 19h20" /></svg>
  if (name === 'close') return <svg {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>
  if (name === 'chevron') return <svg {...props}><path d="m9 18 6-6-6-6" /></svg>
  if (name === 'check') return <svg {...props}><path d="m5 12 4.2 4.2L19 6.7" /></svg>
  if (name === 'contacts') return <svg {...props}><path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 10.5A3.5 3.5 0 1 0 9.5 3a3.5 3.5 0 0 0 0 7.5ZM18 8a3 3 0 0 1 0 6M21 20v-1.5a4 4 0 0 0-2.7-3.8" /></svg>
  if (name === 'creditCard') return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></svg>
  if (name === 'download') return <svg {...props}><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>
  if (name === 'globe') return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.3 2.5 3.5 5.5 3.5 9s-1.2 6.5-3.5 9c-2.3-2.5-3.5-5.5-3.5-9S9.7 5.5 12 3Z" /></svg>
  if (name === 'home') return <svg {...props}><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9Z" /><path d="M9 21v-6h6v6" /></svg>
  if (name === 'insights') return <svg {...props}><path d="M4 19V9M10 19V5M16 19v-7M22 19v-3" /><path d="M2 19h20" /></svg>
  if (name === 'lock') return <svg {...props}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" /></svg>
  if (name === 'logout') return <svg {...props}><path d="M10 17l5-5-5-5M15 12H3M13 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" /></svg>
  if (name === 'menu') return <svg {...props}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
  if (name === 'message') return <svg {...props}><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3.2-.7L4 20l1.6-4.6A7.5 7.5 0 1 1 20 11.5Z" /><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" /></svg>
  if (name === 'moon') return <svg {...props}><path d="M20.5 15.7A8.5 8.5 0 0 1 8.3 3.5 8.5 8.5 0 1 0 20.5 15.7Z" /></svg>
  if (name === 'more') return <svg {...props}><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></svg>
  if (name === 'phone') return <svg {...props}><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M10 6h4M11 18h2" /></svg>
  if (name === 'plus') return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>
  if (name === 'search') return <svg {...props}><circle cx="11" cy="11" r="6" /><path d="m20 20-4.2-4.2" /></svg>
  if (name === 'send') return <svg {...props}><path d="m21 3-8.2 18-3.4-7.4L2 10.2 21 3Z" /><path d="m9.4 13.6 4.7-4.7" /></svg>
  if (name === 'settings') return <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.1-2.1.1-.1A1.7 1.7 0 0 0 7 15a1.7 1.7 0 0 0-1.5-1H5.3v-3h.2A1.7 1.7 0 0 0 7 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h3v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.1 2.1-.1.1A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.5 1h.2v3h-.2a1.7 1.7 0 0 0-1.5 1Z" /></svg>
  if (name === 'shield') return <svg {...props}><path d="M12 3 4.5 6v5.3c0 4.5 3 7.7 7.5 9.7 4.5-2 7.5-5.2 7.5-9.7V6L12 3Z" /><path d="m8.5 12 2.2 2.2 4.8-4.8" /></svg>
  if (name === 'spark') return <svg {...props}><path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></svg>
  if (name === 'sun') return <svg {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
  if (name === 'wallet') return <svg {...props}><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3" /><path d="M3 9h18M16 14h.01" /></svg>
  return <svg {...props}><path d="M6 17a6 6 0 1 1 12 0M12 3v5M12 17v4M3 12h5M16 12h5" /><circle cx="12" cy="12" r="2" /></svg>
}

// Icons are presentation, matched to content by position (extra items fall back to 'spark').
const benefitIcons: IconName[] = ['speed', 'shield', 'insights', 'contacts']
const capabilityIcons: IconName[] = ['send', 'contacts', 'insights', 'globe']

function PublicHome({ content: c }: { content: HomeContent }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [dark, setDark] = useArcLocalTheme()
  const reachPercent = Math.min(100, Math.max(0, c.hero.visual.reachPercent))

  useEffect(() => {
    const update = () => setShowBackToTop(window.scrollY > 520)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className={`public-shell min-h-screen overflow-x-hidden bg-white text-[#102b54] ${dark ? 'theme-dark' : ''}`}>
      <div className="bg-[#062f66] px-5 py-2.5 text-xs text-white/85">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1"><span className="inline-flex items-center gap-2"><Icon name="message" className="h-3.5 w-3.5 text-[#8ed16e]" />{c.topbar.left}</span><span className="hidden sm:inline">{c.topbar.center}</span></div>
          <div className="flex items-center gap-5"><span className="hidden md:inline">{c.topbar.right}</span><SiteThemeToggle dark={dark} setDark={setDark} /><a href="/login" className="font-semibold text-white transition hover:text-[#9fe279]">{c.topbar.signIn}</a></div>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-slate-100/90 bg-white/95 shadow-[0_1px_20px_rgba(18,57,106,0.04)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:py-5">
          <a href="#top" className="flex items-center gap-3" aria-label="ArcLocal home">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#062f66] text-xl font-black text-white shadow-lg shadow-[#062f66]/20">A<span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#54a832] text-[10px] text-white">✦</span></span>
            <span><span className="block text-2xl font-extrabold tracking-tight text-[#12396a]">Arc<span className="text-[#54a832]">Local</span></span><span className="block text-[9px] font-bold tracking-[0.17em] text-slate-400">{c.header.tagline}</span></span>
          </a>

          <button className="rounded-xl border border-slate-200 p-2 text-[#12396a] lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation"><Icon name={menuOpen ? 'close' : 'bars'} className="h-5 w-5" /></button>
          <nav className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-1 border-b border-slate-100 bg-white px-5 py-4 shadow-xl lg:static lg:flex lg:flex-row lg:items-center lg:gap-7 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}>
            {['Platform', 'How it works', 'Why ArcLocal', 'Pricing'].map((item) => <a key={item} onClick={() => setMenuOpen(false)} href={`#${item.toLowerCase().replaceAll(' ', '-')}`} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#12396a] transition hover:bg-[#eff8e9] hover:text-[#54a832]">{item}</a>)}
            <a onClick={() => setMenuOpen(false)} href="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#12396a] transition hover:text-[#54a832]">{c.header.login}</a>
            <a onClick={() => setMenuOpen(false)} href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#54a832] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#54a832]/20 transition hover:-translate-y-0.5 hover:bg-[#448e29]">{c.header.cta} <Icon name="arrow" className="h-4 w-4" /></a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_14%_22%,#ecf8e8_0,transparent_28%),linear-gradient(180deg,#ffffff_0%,#f7fbf6_100%)]">
          <div className="absolute right-[-16rem] top-[-17rem] -z-10 h-[34rem] w-[34rem] rounded-full bg-[#54a832]/10 blur-3xl" />
          <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-12 pt-14 sm:pt-20 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:pb-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#cfe9c3] bg-white px-4 py-2 text-sm font-bold text-[#2f7620] shadow-sm"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e6f5df]"><Icon name="spark" className="h-3.5 w-3.5" /></span>{c.hero.badge}</div>
              <h1 className="mt-7 text-5xl font-extrabold leading-[0.98] tracking-[-0.055em] text-[#12396a] sm:text-6xl lg:text-7xl">{c.hero.headlineStart} <span className="text-[#54a832]">{c.hero.headlineAccent}</span></h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">{c.hero.body}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#062f66] px-6 py-4 font-bold text-white shadow-xl shadow-[#062f66]/20 transition hover:-translate-y-0.5 hover:bg-[#0d4a8a]">{c.hero.primaryCta} <Icon name="arrow" className="h-5 w-5" /></a><a href="#platform" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#bcd5ec] bg-white px-6 py-4 font-bold text-[#12396a] transition hover:border-[#54a832] hover:text-[#54a832]">{c.hero.secondaryCta} <Icon name="send" className="h-5 w-5" /></a></div>
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 text-sm font-semibold text-slate-600">{c.hero.checks.map((check, i) => <span key={`${check}-${i}`} className="inline-flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e7f6e1] text-[#398526]"><Icon name="check" className="h-4 w-4" /></span>{check}</span>)}</div>
            </div>

            <div className="relative mx-auto w-full max-w-[620px] lg:mr-0">
              <div className="absolute inset-x-[7%] bottom-[7%] top-[6%] rounded-[2.5rem] bg-[#062f66] shadow-[0_32px_70px_-24px_rgba(6,47,102,0.65)]" />
              <div className="absolute bottom-[5%] right-[5%] top-[6%] w-[49%] rounded-r-[2.5rem] bg-[linear-gradient(135deg,#54a832,#9cda6d)]" />
              <div className="relative min-h-[490px] overflow-hidden rounded-[2rem] border border-white/50 bg-[#062f66] px-6 pt-7 sm:min-h-[550px] sm:px-9">
                <div className="relative z-10 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9de17b]">{c.hero.visual.campaignLabel}</p><p className="mt-1 text-xl font-extrabold text-white">{c.hero.visual.campaignTitle}</p></div><span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white">{c.hero.visual.liveBadge}</span></div>
                <div className="absolute left-4 top-[30%] z-20 w-40 rounded-2xl border border-white/15 bg-white/95 p-4 shadow-xl sm:left-7 sm:w-48"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{c.hero.visual.reachLabel}</p><p className="mt-1 text-2xl font-extrabold text-[#12396a]">{c.hero.visual.reachValue}</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#54a832]" style={{ width: `${reachPercent}%` }} /></div><p className="mt-2 text-xs font-semibold text-[#54a832]">{reachPercent}% {c.hero.visual.reachCaption}</p></div>
                <img src="/arclocal-sms-phone.png" alt="ArcLocal SMS delivery dashboard on a phone" className="absolute bottom-[-8%] left-1/2 z-10 w-[68%] max-w-[390px] -translate-x-1/2 drop-shadow-[0_28px_35px_rgba(0,0,0,0.45)] sm:bottom-[-10%]" />
                <div className="absolute bottom-11 right-4 z-20 w-44 rounded-2xl border border-white/40 bg-[#f8fff5]/95 p-4 shadow-xl sm:right-7 sm:w-52"><div className="flex items-center gap-2 text-[#32801f]"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dff3d6]"><Icon name="check" className="h-4 w-4" /></span><span className="text-xs font-bold">{c.hero.visual.receiptTitle}</span></div><p className="mt-2 text-xs leading-5 text-slate-500">{c.hero.visual.receiptText}</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-2 max-w-7xl px-5 pb-4 lg:-mt-8">
          <div className="grid overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_18px_45px_-35px_rgba(18,57,106,0.45)] sm:grid-cols-2 lg:grid-cols-4">
            {c.benefits.map(({ title, text }, index) => <div key={`${title}-${index}`} className={`flex gap-4 px-5 py-6 ${index > 0 ? 'border-t border-slate-100 sm:border-l sm:border-t-0' : ''} ${index === 2 ? 'lg:border-l' : ''}`}><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf6fa] text-[#12396a]"><Icon name={benefitIcons[index] ?? 'spark'} className="h-6 w-6" /></span><div><h2 className="font-extrabold text-[#12396a]">{title}</h2><p className="mt-1 text-sm leading-5 text-slate-500">{text}</p></div></div>)}
          </div>
        </section>

        <section id="platform" className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#54a832]">{c.platform.eyebrow}</p><h2 className="mt-3 text-4xl font-extrabold tracking-tight text-[#12396a] sm:text-5xl">{c.platform.title}</h2><p className="mt-5 text-lg leading-8 text-slate-600">{c.platform.body}</p></div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{c.platform.items.map(({ title, text }, index) => <article key={`${title}-${index}`} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#bfe4ad] hover:shadow-xl hover:shadow-[#12396a]/10"><span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${index % 2 === 0 ? 'bg-[#edf5fc] text-[#12396a]' : 'bg-[#eff9ea] text-[#54a832]'}`}><Icon name={capabilityIcons[index] ?? 'spark'} className="h-7 w-7" /></span><h3 className="mt-7 text-xl font-extrabold text-[#12396a]">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p><a href="/register" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#54a832] transition group-hover:gap-3">{c.platform.cardLink} <Icon name="arrow" className="h-4 w-4" /></a></article>)}</div>
        </section>

        <section id="how-it-works" className="bg-[#f5f9fe] py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#54a832]">{c.how.eyebrow}</p><h2 className="mt-3 text-4xl font-extrabold tracking-tight text-[#12396a] sm:text-5xl">{c.how.title}</h2><p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">{c.how.body}</p><a href="/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#54a832] px-6 py-4 font-bold text-white shadow-lg shadow-[#54a832]/20 transition hover:-translate-y-0.5 hover:bg-[#448e29]">{c.how.cta} <Icon name="arrow" className="h-5 w-5" /></a></div><ol className="space-y-4">{c.how.steps.map(({ title, text }, index) => <li key={`${title}-${index}`} className="flex gap-5 rounded-2xl border border-white bg-white p-6 shadow-sm"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#062f66] text-sm font-extrabold text-[#9de17b]">{String(index + 1).padStart(2, '0')}</span><div><h3 className="text-lg font-extrabold text-[#12396a]">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div></li>)}</ol></div>
        </section>

        <section id="why-arclocal" className="mx-auto max-w-7xl px-5 py-20 sm:py-24"><div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-[linear-gradient(135deg,#062f66_0%,#12396a_55%,#2f7d47_150%)] px-7 py-10 text-white shadow-[0_30px_85px_-38px_rgba(6,47,102,.85)] sm:px-12 sm:py-14"><div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#8ed16e]/20 blur-3xl" /><div className="relative grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b4eb98]">{c.why.eyebrow}</p><h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{c.why.title}</h2><p className="mt-6 max-w-xl text-lg leading-8 text-white/75">{c.why.body}</p><div className="mt-8 flex flex-wrap gap-3">{c.why.chips.map((chip, i) => <span key={`${chip}-${i}`} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">{chip}</span>)}</div></div><div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#54a832] text-white"><Icon name="shield" className="h-6 w-6" /></span><div><p className="font-extrabold">{c.why.panel.title}</p><p className="text-sm text-white/60">{c.why.panel.subtitle}</p></div></div><span className="rounded-full bg-[#54a832]/20 px-3 py-1 text-xs font-bold text-[#c4f1ad]">{c.why.panel.status}</span></div><div className="my-6 h-px bg-white/10" /><div className="grid grid-cols-2 gap-4 text-sm"><div className="rounded-xl bg-white/10 p-4"><p className="text-white/55">{c.why.panel.stat1Label}</p><p className="mt-1 font-extrabold">{c.why.panel.stat1Value}</p></div><div className="rounded-xl bg-white/10 p-4"><p className="text-white/55">{c.why.panel.stat2Label}</p><p className="mt-1 font-extrabold">{c.why.panel.stat2Value}</p></div></div></div></div></div></section>

        <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 text-center sm:py-24"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#54a832]">{c.cta.eyebrow}</p><h2 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-[#12396a] sm:text-5xl">{c.cta.title}</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">{c.cta.body}</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><a href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#54a832] px-7 py-4 font-bold text-white shadow-lg shadow-[#54a832]/20 transition hover:-translate-y-0.5 hover:bg-[#448e29]">{c.cta.primary} <Icon name="arrow" className="h-5 w-5" /></a><a href="/login" className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-7 py-4 font-bold text-[#12396a] transition hover:border-[#54a832] hover:text-[#54a832]">{c.cta.secondary}</a></div></section>
      </main>

      <footer className="border-t border-slate-200 bg-[#f8fbfd] px-5 pt-14 text-sm text-slate-600"><div className="mx-auto grid max-w-7xl gap-10 pb-12 md:grid-cols-[1.4fr_0.8fr_0.9fr_1fr]"><div><div className="text-3xl font-extrabold text-[#12396a]">Arc<span className="text-[#54a832]">Local</span></div><p className="mt-4 max-w-xs leading-6">{c.footer.about}</p></div><div><h3 className="font-extrabold text-[#12396a]">Platform</h3><div className="mt-4 space-y-3"><a className="block transition hover:text-[#54a832]" href="#platform">Campaigns</a><a className="block transition hover:text-[#54a832]" href="#how-it-works">How it works</a><a className="block transition hover:text-[#54a832]" href="#why-arclocal">Why ArcLocal</a></div></div><div><h3 className="font-extrabold text-[#12396a]">Get started</h3><div className="mt-4 space-y-3"><a className="block transition hover:text-[#54a832]" href="/register">Request access</a><a className="block transition hover:text-[#54a832]" href="/login">Sign in</a><a className="block transition hover:text-[#54a832]" href="#pricing">Pricing</a></div></div><div><h3 className="font-extrabold text-[#12396a]">{c.footer.opsTitle}</h3><p className="mt-4 leading-6">{c.footer.opsText}</p></div></div><div className="border-t border-slate-200 py-5"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs sm:flex-row"><span>{c.footer.copyright}</span><span>{c.footer.legal}</span></div></div></footer>
      <button className={`public-back-to-top ${showBackToTop ? 'visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><Icon name="arrow" className="h-5 w-5 -rotate-90" /><span>Back to top</span></button>
    </div>
  )
}

export default PublicHome
