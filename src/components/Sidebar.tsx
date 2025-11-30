import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Heart, BookOpen, TrendingUp, Menu, X, AlertCircle, UtensilsCrossed, Settings, Moon, Lightbulb, Calendar, CheckSquare } from 'lucide-react'
import { usePet } from '../contexts/PetContext'

const Sidebar = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { preferences } = usePet()

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard', emoji: '🌱' },
    { path: '/mood', icon: Heart, label: 'Mood', emoji: '😊' },
    { path: '/stress', icon: AlertCircle, label: 'Stress', emoji: '😰' },
    { path: '/appetite', icon: UtensilsCrossed, label: 'Appetite', emoji: '🍽️' },
    { path: '/sleep', icon: Moon, label: 'Sleep', emoji: '😴' },
    { path: '/calendar', icon: Calendar, label: 'Calendar', emoji: '📅' },
    { path: '/todos', icon: CheckSquare, label: 'To-Do', emoji: '✅' },
    { path: '/journal', icon: BookOpen, label: 'Journal', emoji: '📔' },
    { path: '/tips', icon: Lightbulb, label: 'Tips', emoji: '💡' },
    { path: '/insights', icon: TrendingUp, label: 'Insights', emoji: '📊' },
    { path: '/settings', icon: Settings, label: 'Settings', emoji: '⚙️' },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/80 backdrop-blur-lg rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-r border-soft-lavender/30 dark:border-gray-700/30 shadow-sm z-40 transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">🌱</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-garden-emerald bg-clip-text text-transparent">
              MoodGarden
            </h1>
          </div>
          {preferences.petName && (
            <div className="flex items-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
              <span>{preferences.petType === 'cat' ? '🐱' : '🐶'}</span>
              <span>{preferences.petName}</span>
            </div>
          )}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-soft-lavender/50 dark:hover:bg-gray-700/50 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  <span className="text-lg">{item.emoji}</span>
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

