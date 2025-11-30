import { useState } from 'react'
import { format, isSameDay } from 'date-fns'
import { Moon, Plus, Edit2 } from 'lucide-react'
import { SleepEntry } from '../types'

interface SleepTrackerProps {
  sleepEntries: SleepEntry[]
  setSleepEntries: (entries: SleepEntry[] | ((prev: SleepEntry[]) => SleepEntry[])) => void
}

const SleepTracker = ({ sleepEntries, setSleepEntries }: SleepTrackerProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [hours, setHours] = useState(8)
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [bedtime, setBedtime] = useState('22:00')
  const [wakeTime, setWakeTime] = useState('07:00')
  const [notes, setNotes] = useState('')

  const today = new Date()
  const dateStr = format(selectedDate, 'yyyy-MM-dd')
  const todayEntry = sleepEntries.find(e => e.date === dateStr)

  const handleOpenModal = () => {
    if (todayEntry) {
      setHours(todayEntry.hours)
      setQuality(todayEntry.quality)
      setBedtime(todayEntry.bedtime || '22:00')
      setWakeTime(todayEntry.wakeTime || '07:00')
      setNotes(todayEntry.notes || '')
    } else {
      setHours(8)
      setQuality(3)
      setBedtime('22:00')
      setWakeTime('07:00')
      setNotes('')
    }
    setShowModal(true)
  }

  const handleSave = () => {
    const existingIndex = sleepEntries.findIndex(e => e.date === dateStr)

    const newEntry: SleepEntry = {
      id: existingIndex >= 0 ? sleepEntries[existingIndex].id : crypto.randomUUID(),
      date: dateStr,
      hours,
      quality,
      bedtime: bedtime || undefined,
      wakeTime: wakeTime || undefined,
      notes: notes.trim() || undefined,
    }

    if (existingIndex >= 0) {
      setSleepEntries(prev => prev.map((e, i) => i === existingIndex ? newEntry : e))
    } else {
      setSleepEntries(prev => [...prev, newEntry])
    }

    setShowModal(false)
  }

  const qualityLabels = {
    1: { label: 'Poor', emoji: '😴', color: 'bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    2: { label: 'Fair', emoji: '😪', color: 'bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    3: { label: 'Good', emoji: '😌', color: 'bg-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    4: { label: 'Very Good', emoji: '😊', color: 'bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    5: { label: 'Excellent', emoji: '😄', color: 'bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  }

  const recentEntries = [...sleepEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-3">
            <span className="text-4xl">😴</span>
            <Moon className="text-primary-600 dark:text-primary-400" size={32} />
            Sleep Tracker
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Track your sleep patterns and quality</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Log Sleep
        </button>
      </div>

      {/* Date Selector */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-soft-lavender/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedDate(today)}
              className="px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-soft-lavender/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {todayEntry ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-soft-sky/50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hours Slept</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{todayEntry.hours}h</p>
              </div>
              <div className={`p-4 rounded-xl ${qualityLabels[todayEntry.quality].color}`}>
                <p className="text-sm mb-1">Quality</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  <span>{qualityLabels[todayEntry.quality].emoji}</span>
                  {qualityLabels[todayEntry.quality].label}
                </p>
              </div>
            </div>
            {(todayEntry.bedtime || todayEntry.wakeTime) && (
              <div className="grid grid-cols-2 gap-4">
                {todayEntry.bedtime && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Bedtime</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{todayEntry.bedtime}</p>
                  </div>
                )}
                {todayEntry.wakeTime && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Wake Time</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{todayEntry.wakeTime}</p>
                  </div>
                )}
              </div>
            )}
            {todayEntry.notes && (
              <div className="p-4 bg-soft-cream/50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">{todayEntry.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
            No sleep entry for this date. Click "Log Sleep" to add one! 🌙
          </p>
        )}
      </div>

      {/* Recent Sleep History */}
      {recentEntries.length > 0 && (
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Recent Sleep History</h3>
          <div className="space-y-3">
            {recentEntries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{qualityLabels[entry.quality].emoji}</span>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {format(new Date(entry.date), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.hours}h • {qualityLabels[entry.quality].label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedDate(new Date(entry.date))
                    handleOpenModal()
                  }}
                  className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-in shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>

            <div className="space-y-6">
              {/* Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Hours Slept
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setHours(Math.max(0, hours - 0.5))}
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="text-3xl font-bold text-gray-800 dark:text-gray-200 w-20 text-center">
                    {hours}h
                  </span>
                  <button
                    onClick={() => setHours(Math.min(24, hours + 0.5))}
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Quality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Sleep Quality
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {([1, 2, 3, 4, 5] as const).map(q => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`p-3 rounded-xl transition-all duration-200 ${
                        quality === q
                          ? `${qualityLabels[q].color} scale-110 ring-4 ring-primary-200 dark:ring-primary-800`
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">{qualityLabels[q].emoji}</div>
                      <div className="text-xs font-medium">{q}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bedtime (optional)
                  </label>
                  <input
                    type="time"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Wake Time (optional)
                  </label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did you sleep?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
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

export default SleepTracker

