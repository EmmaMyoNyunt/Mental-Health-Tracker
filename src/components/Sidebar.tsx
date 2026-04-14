import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Heart, BookOpen, TrendingUp, Menu, X, AlertCircle, UtensilsCrossed, Settings, Moon, Lightbulb, Calendar, CheckSquare, Footprints } from 'lucide-react'
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
        className="fixed left-4 top-4 z-50 rounded-lg border border-amber-200/60 bg-stone-100/90 p-2 shadow-lg backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/90 lg:hidden"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Top Navbar */}
      <header className="fixed left-0 top-0 z-40 hidden w-full border-b border-amber-200/60 bg-stone-100/90 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/90 lg:block">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-3 px-4">
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xl">🌱</span>
            <h1 className="bg-gradient-to-r from-primary-600 via-teal-600 to-emerald-600 bg-clip-text text-xl font-bold text-transparent">
              MoodGarden
            </h1>
          </div>

          <nav className="grid min-w-0 flex-1 grid-cols-11 gap-1 px-2 py-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs transition xl:text-sm ${
                    isActive
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-950/50 dark:text-primary-300'
                      : 'text-stone-600 hover:bg-white/70 hover:text-primary-700 dark:text-stone-300 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden 2xl:inline">{item.label}</span>
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
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-950/50 dark:text-primary-300'
                  : 'surface-chip text-muted hover:text-heading'
              }`}
            >
              <Settings size={16} />
              <span className="hidden 2xl:inline">Settings</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      <aside className={`fixed left-0 top-0 z-40 h-full w-56 border-r border-amber-200/50 bg-stone-100/92 shadow-sm backdrop-blur-xl transition-transform duration-300 dark:border-slate-700/60 dark:bg-slate-900/92 dark:shadow-card-dark lg:hidden ${
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
                      ? 'bg-primary-100 text-primary-800 shadow-md dark:bg-primary-950/50 dark:text-primary-300'
                      : 'text-stone-600 hover:bg-white/70 hover:text-primary-700 dark:text-stone-300 dark:hover:bg-slate-800/80'
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

