import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns'
import { Heart, Plus } from 'lucide-react'
import { MoodEntry, MoodLevel } from '../types'

interface MoodTrackerProps {
  moodEntries: MoodEntry[]
  setMoodEntries: (entries: MoodEntry[] | ((prev: MoodEntry[]) => MoodEntry[])) => void
}

const MoodTracker = ({ moodEntries, setMoodEntries }: MoodTrackerProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null)
  const [notes, setNotes] = useState('')

  const today = new Date()
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Add padding days for calendar grid
  const firstDayOfWeek = monthStart.getDay()
  const paddingDays = Array.from({ length: firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 }, (_, i) => null)

  const handleMoodSelect = (mood: MoodLevel) => {
    setSelectedMood(mood)
  }

  const handleSave = () => {
    if (!selectedMood) return

    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    const existingIndex = moodEntries.findIndex(e => e.date === dateStr)

    const newEntry: MoodEntry = {
      id: existingIndex >= 0 ? moodEntries[existingIndex].id : crypto.randomUUID(),
      date: dateStr,
      mood: selectedMood,
      notes: notes.trim() || undefined,
    }

    if (existingIndex >= 0) {
      setMoodEntries(prev => prev.map((e, i) => i === existingIndex ? newEntry : e))
    } else {
      setMoodEntries(prev => [...prev, newEntry])
    }

    setShowModal(false)
    setSelectedMood(null)
    setNotes('')
  }

  const getMoodForDate = (date: Date) => {
    return moodEntries.find(e => isSameDay(new Date(e.date), date))
  }

  const moodColors: Record<MoodLevel, string> = {
    1: 'bg-red-200 text-red-700 border-red-300',
    2: 'bg-orange-200 text-orange-700 border-orange-300',
    3: 'bg-yellow-200 text-yellow-700 border-yellow-300',
    4: 'bg-green-200 text-green-700 border-green-300',
    5: 'bg-emerald-200 text-emerald-700 border-emerald-300',
  }

  const moodLabels: Record<MoodLevel, string> = {
    1: 'Poor',
    2: 'Not Great',
    3: 'Okay',
    4: 'Good',
    5: 'Excellent',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Heart className="text-primary-600" size={32} />
            Mood Tracker
          </h2>
          <p className="text-gray-600">Track your daily mood and emotions</p>
        </div>
        <button
          onClick={() => {
            setSelectedDate(new Date())
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Add Mood
        </button>
      </div>

      {/* Calendar */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {format(selectedDate, 'MMMM yyyy')}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
              className="px-4 py-2 text-gray-600 hover:bg-soft-lavender/50 rounded-lg transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
              className="px-4 py-2 text-gray-600 hover:bg-soft-lavender/50 rounded-lg transition-colors"
            >
              →
            </button>
            <button
              onClick={() => setSelectedDate(today)}
              className="px-4 py-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
          {paddingDays.map((_, idx) => (
            <div key={`pad-${idx}`} />
          ))}
          {monthDays.map(day => {
            const entry = getMoodForDate(day)
            const isToday = isSameDay(day, today)
            const isCurrentMonth = isSameMonth(day, selectedDate)
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => {
                  setSelectedDate(day)
                  setShowModal(true)
                  if (entry) {
                    setSelectedMood(entry.mood)
                    setNotes(entry.notes || '')
                  } else {
                    setSelectedMood(null)
                    setNotes('')
                  }
                }}
                className={`relative p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  entry
                    ? `${moodColors[entry.mood]} border-2`
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
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

      {/* Mood Legend */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Scale</h3>
        <div className="grid grid-cols-5 gap-4">
          {([1, 2, 3, 4, 5] as MoodLevel[]).map(mood => (
            <div key={mood} className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-lg ${moodColors[mood]}`}>
                {mood}
              </div>
              <p className="text-sm text-gray-600">{moodLabels[mood]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-in shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            <p className="text-gray-600 mb-6">How are you feeling today?</p>

            <div className="grid grid-cols-5 gap-3 mb-6">
              {([1, 2, 3, 4, 5] as MoodLevel[]).map(mood => (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 ${
                    selectedMood === mood
                      ? `${moodColors[mood]} scale-110 ring-4 ring-primary-200`
                      : `${moodColors[mood]} opacity-60 hover:opacity-100 hover:scale-105`
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How are you feeling? What's on your mind?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedMood(null)
                  setNotes('')
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedMood}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default MoodTracker

