import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Heart, BookOpen, TrendingUp, Menu, X, AlertCircle, UtensilsCrossed, Settings, Moon, Lightbulb, Calendar, CalendarDays, CheckSquare, Footprints } from 'lucide-react'
import { usePet } from '../contexts/PetContext'

const Sidebar = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { preferences } = usePet()

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/mood', icon: Heart, label: 'Mood' },
    { path: '/stress', icon: AlertCircle, label: 'Stress' },
    { path: '/appetite', icon: UtensilsCrossed, label: 'Appetite' },
    { path: '/sleep', icon: Moon, label: 'Sleep' },
    { path: '/movement', icon: Footprints, label: 'Movement' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/key-dates', icon: CalendarDays, label: 'Key\u00A0dates' },
    { path: '/todos', icon: CheckSquare, label: 'To-Do' },
    { path: '/journal', icon: BookOpen, label: 'Journal' },
    { path: '/tips', icon: Lightbulb, label: 'Tips' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-emerald-400/45 bg-gradient-to-br from-white/80 via-emerald-50/70 to-cyan-50/50 p-2 shadow-lg shadow-emerald-900/15 backdrop-blur-lg dark:border-emerald-500/30 dark:bg-gradient-to-br dark:from-slate-950/95 dark:via-emerald-950/50 dark:to-indigo-950/40 dark:shadow-lg dark:shadow-black/40 lg:hidden"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Top Navbar */}
      <header className="fixed left-0 top-0 z-40 hidden w-full border-b border-emerald-400/40 bg-gradient-to-r from-white/85 via-emerald-50/65 to-sky-50/55 shadow-sm shadow-emerald-900/10 backdrop-blur-xl dark:border-slate-700/70 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 dark:shadow-none dark:backdrop-blur-xl lg:block">
        <div className="mx-auto flex h-16 w-full max-w-[1920px] items-center gap-5 px-5 lg:gap-6 lg:px-10">
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xl">🌱</span>
            <h1 className="bg-gradient-to-r from-primary-600 via-teal-600 to-emerald-600 bg-clip-text text-xl font-bold text-transparent">
              MoodGarden
            </h1>
          </div>

          <nav className="flex min-w-0 flex-1 flex-nowrap items-center justify-between gap-x-2 overflow-x-auto overflow-y-hidden px-1 py-1 sm:gap-x-3 md:gap-x-4 lg:gap-x-5 xl:gap-x-6 [&::-webkit-scrollbar]:h-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-2 text-xs transition xl:gap-2 xl:px-3 xl:text-sm ${
                    isActive
                      ? 'bg-primary-100 text-primary-800 dark:bg-emerald-950/60 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-400/30'
                      : 'text-stone-600 hover:bg-white/70 hover:text-primary-700 dark:text-stone-200 dark:hover:bg-white/5 dark:hover:text-stone-50'
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="hidden whitespace-nowrap 2xl:inline">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="ml-1 flex shrink-0 items-center gap-2">
            {preferences.petName ? (
              <div className="surface-chip flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted">
                <span>{preferences.petType === 'cat' ? '🐱' : '🐶'}</span>
                <span>{preferences.petName}</span>
              </div>
            ) : null}
            <Link
              to="/settings"
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
                location.pathname === '/settings'
                  ? 'bg-primary-100 text-primary-800 dark:bg-emerald-950/60 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-400/30'
                  : 'surface-chip text-muted hover:text-heading dark:text-stone-200'
              }`}
            >
              <Settings size={16} />
              <span className="hidden 2xl:inline">Settings</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      <aside className={`fixed left-0 top-0 z-40 h-full w-56 border-r border-emerald-400/35 bg-gradient-to-b from-emerald-50/90 via-white/85 to-fuchsia-50/40 shadow-md shadow-emerald-900/10 backdrop-blur-xl transition-transform duration-300 dark:border-emerald-500/20 dark:bg-gradient-to-b dark:from-slate-950/98 dark:via-emerald-950/35 dark:to-violet-950/40 dark:shadow-xl dark:shadow-black/35 lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <span className="text-3xl">🌱</span>
            <h1 className="bg-gradient-to-r from-primary-600 via-teal-600 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent">
              MoodGarden
            </h1>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-800 shadow-md dark:bg-emerald-950/60 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-400/30'
                      : 'text-stone-600 hover:bg-white/70 hover:text-primary-700 dark:text-stone-200 dark:hover:bg-white/5 dark:hover:text-stone-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar

