import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Heart,
  BookOpen,
  TrendingUp,
  Menu,
  X,
  AlertCircle,
  UtensilsCrossed,
  Settings,
  Moon,
  Lightbulb,
  Calendar,
  CalendarDays,
  CheckSquare,
  Footprints,
} from 'lucide-react'
import { usePet } from '../contexts/PetContext'

const Sidebar = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { preferences } = usePet()

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/mood', icon: Heart, label: 'Mood' },
    { path: '/stress', icon: AlertCircle, label: 'Stress' },
    { path: '/appetite', icon: UtensilsCrossed, label: 'Appetite' },
    { path: '/sleep', icon: Moon, label: 'Sleep' },
    { path: '/movement', icon: Footprints, label: 'Movement' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/key-dates', icon: CalendarDays, label: 'Key dates' },
    { path: '/todos', icon: CheckSquare, label: 'To-Do' },
    { path: '/journal', icon: BookOpen, label: 'Journal' },
    { path: '/tips', icon: Lightbulb, label: 'Tips' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [menuOpen])

  return (
    <>
      <header className="fixed left-0 top-0 z-40 flex h-14 w-full items-center gap-3 border-b border-emerald-400/45 bg-gradient-to-r from-white/95 via-emerald-50/75 to-sky-50/60 px-3 shadow-sm shadow-emerald-900/10 backdrop-blur-xl dark:border-slate-600 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 sm:px-4">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/50 bg-white text-stone-900 shadow-sm transition hover:bg-emerald-50/90 dark:border-slate-500 dark:bg-slate-800 dark:text-stone-50 dark:hover:bg-slate-700"
          aria-expanded={menuOpen}
          aria-controls="app-nav-drawer"
          aria-label="Open navigation menu"
        >
          <Menu size={22} strokeWidth={2} aria-hidden />
        </button>

        <Link
          to="/"
          className="flex min-w-0 shrink items-center gap-2 rounded-lg py-1 pr-2 text-left transition hover:opacity-90"
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-xl leading-none" aria-hidden>
            🌱
          </span>
          <span className="bg-gradient-to-r from-primary-600 via-teal-600 to-emerald-600 bg-clip-text text-lg font-bold text-transparent sm:text-xl">
            MoodGarden
          </span>
        </Link>

        {preferences.petName ? (
          <div className="ml-auto flex min-w-0 max-w-[45vw] items-center gap-1.5 truncate rounded-lg border border-emerald-400/40 bg-white/90 px-2 py-1.5 text-xs text-stone-700 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-stone-200 sm:max-w-xs sm:text-sm">
            <span className="shrink-0">{preferences.petType === 'cat' ? '🐱' : '🐶'}</span>
            <span className="truncate">{preferences.petName}</span>
          </div>
        ) : null}
      </header>

      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] dark:bg-black/70"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <aside
        id="app-nav-drawer"
        className={`fixed left-0 top-0 z-50 flex h-dvh max-h-screen w-[min(100vw-1rem,20rem)] flex-col border-r shadow-2xl transition-transform duration-300 ease-out sm:w-80 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } border-emerald-400/45 bg-gradient-to-b from-emerald-50/95 via-white/95 to-fuchsia-50/55 shadow-emerald-900/20 backdrop-blur-xl dark:border-slate-500 dark:!bg-slate-950 dark:shadow-black/60`}
        aria-hidden={!menuOpen}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-emerald-400/40 bg-white/50 px-4 py-3 dark:border-slate-600 dark:bg-slate-900">
          <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">Navigation</p>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stone-200 text-stone-700 transition hover:bg-white dark:border-slate-600 dark:text-stone-100 dark:hover:bg-slate-800"
            aria-label="Close navigation menu"
          >
            <X size={22} aria-hidden />
          </button>
        </div>

        <nav
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-white/40 px-3 py-3 dark:bg-slate-950"
          aria-label="Main navigation"
        >
          <ul className="space-y-1 pb-10">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                      isActive
                        ? 'bg-primary-100 font-semibold text-primary-950 shadow-sm ring-1 ring-primary-300/80 dark:bg-emerald-900/55 dark:text-emerald-50 dark:ring-emerald-400/45'
                        : 'text-stone-800 hover:bg-white/95 dark:text-stone-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={20} className="shrink-0 opacity-95 dark:opacity-100" aria-hidden />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
