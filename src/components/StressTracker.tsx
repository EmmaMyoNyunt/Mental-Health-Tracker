import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns'
import { AlertCircle, Plus } from 'lucide-react'
import { StressEntry, StressLevel } from '../types'

interface StressTrackerProps {
  stressEntries: StressEntry[]
  setStressEntries: (entries: StressEntry[] | ((prev: StressEntry[]) => StressEntry[])) => void
}

const StressTracker = ({ stressEntries, setStressEntries }: StressTrackerProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [selectedStress, setSelectedStress] = useState<StressLevel | null>(null)
  const [notes, setNotes] = useState('')
  const [triggers, setTriggers] = useState('')

  const today = new Date()
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const firstDayOfWeek = monthStart.getDay()
  const paddingDays = Array.from({ length: firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 }, (_, i) => null)

  const handleSave = () => {
    if (!selectedStress) return

    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    const existingIndex = stressEntries.findIndex(e => e.date === dateStr)

    const newEntry: StressEntry = {
      id: existingIndex >= 0 ? stressEntries[existingIndex].id : crypto.randomUUID(),
      date: dateStr,
      stressLevel: selectedStress,
      notes: notes.trim() || undefined,
      triggers: triggers.trim() ? triggers.split(',').map(t => t.trim()) : undefined,
    }

    if (existingIndex >= 0) {
      setStressEntries(prev => prev.map((e, i) => i === existingIndex ? newEntry : e))
    } else {
      setStressEntries(prev => [...prev, newEntry])
    }

    setShowModal(false)
    setSelectedStress(null)
    setNotes('')
    setTriggers('')
  }

  const getStressForDate = (date: Date) => {
    return stressEntries.find(e => isSameDay(new Date(e.date), date))
  }

  const stressColors: Record<StressLevel, string> = {
    1: 'bg-green-200 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400',
    2: 'bg-emerald-200 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400',
    3: 'bg-yellow-200 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400',
    4: 'bg-orange-200 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400',
    5: 'bg-red-200 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400',
  }

  const stressLabels: Record<StressLevel, string> = {
    1: 'Very Low',
    2: 'Low',
    3: 'Moderate',
    4: 'High',
    5: 'Very High',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-3">
            <span className="text-4xl">😰</span>
            <AlertCircle className="text-primary-600 dark:text-primary-400" size={32} />
            Stress Tracker
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor your stress levels daily</p>
        </div>
        <button
          onClick={() => {
            setSelectedDate(new Date())
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Add Stress Level
        </button>
      </div>

      {/* Calendar */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {format(selectedDate, 'MMMM yyyy')}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-soft-lavender/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-soft-lavender/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              →
            </button>
            <button
              onClick={() => setSelectedDate(today)}
              className="px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
          {paddingDays.map((_, idx) => (
            <div key={`pad-${idx}`} />
          ))}
          {monthDays.map(day => {
            const entry = getStressForDate(day)
            const isToday = isSameDay(day, today)
            const isCurrentMonth = isSameMonth(day, selectedDate)
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => {
                  setSelectedDate(day)
                  setShowModal(true)
                  if (entry) {
                    setSelectedStress(entry.stressLevel)
                    setNotes(entry.notes || '')
                    setTriggers(entry.triggers?.join(', ') || '')
                  } else {
                    setSelectedStress(null)
                    setNotes('')
                    setTriggers('')
                  }
                }}
                className={`relative p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  entry
                    ? `${stressColors[entry.stressLevel]} border-2`
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                } ${isToday ? 'ring-2 ring-primary-400' : ''} ${
                  !isCurrentMonth ? 'opacity-40' : ''
                }`}
              >
                <span className={`text-sm font-medium ${isToday ? 'font-bold' : ''}`}>
                  {format(day, 'd')}
                </span>
                {entry && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stress Legend */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Stress Scale</h3>
        <div className="grid grid-cols-5 gap-4">
          {([1, 2, 3, 4, 5] as StressLevel[]).map(level => (
            <div key={level} className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-lg ${stressColors[level]}`}>
                {level}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stressLabels[level]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-in shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">What's your stress level today?</p>

            <div className="grid grid-cols-5 gap-3 mb-6">
              {([1, 2, 3, 4, 5] as StressLevel[]).map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedStress(level)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 ${
                    selectedStress === level
                      ? `${stressColors[level]} scale-110 ring-4 ring-primary-200 dark:ring-primary-800`
                      : `${stressColors[level]} opacity-60 hover:opacity-100 hover:scale-105`
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stress Triggers (comma-separated)
              </label>
              <input
                type="text"
                value={triggers}
                onChange={(e) => setTriggers(e.target.value)}
                placeholder="work, deadlines, social events..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How are you feeling? What's causing stress?"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedStress(null)
                  setNotes('')
                  setTriggers('')
                }}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedStress}
                className="flex-1 px-4 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StressTracker

