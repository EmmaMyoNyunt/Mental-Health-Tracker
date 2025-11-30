import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns'
import { Heart, Plus, X } from 'lucide-react'
import { MoodEntry } from '../types'
import { EMOTIONS, getEmotionsByColor, getColorClasses, getEmotionById } from '../utils/emotions'

interface MoodTrackerProps {
  moodEntries: MoodEntry[]
  setMoodEntries: (entries: MoodEntry[] | ((prev: MoodEntry[]) => MoodEntry[])) => void
}

const MoodTracker = ({ moodEntries, setMoodEntries }: MoodTrackerProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [selectedEmotionIds, setSelectedEmotionIds] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [selectedColor, setSelectedColor] = useState<'yellow' | 'red' | 'green' | 'blue' | 'gray' | null>(null)

  const today = new Date()
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const firstDayOfWeek = monthStart.getDay()
  const paddingDays = Array.from({ length: firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 }, () => null)

  const emotionsByColor = getEmotionsByColor()

  const handleSave = () => {
    if (selectedEmotionIds.length === 0) return

    const emotions = selectedEmotionIds
      .map(id => getEmotionById(id))
      .filter((e): e is NonNullable<typeof e> => e !== undefined)

    if (emotions.length === 0) return

    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    const existingIndex = moodEntries.findIndex(e => e.date === dateStr)

    // For backward compatibility, set primary emotion
    const primaryEmotion = emotions[0]

    const newEntry: MoodEntry = {
      id: existingIndex >= 0 ? moodEntries[existingIndex].id : crypto.randomUUID(),
      date: dateStr,
      valence: primaryEmotion.valence,
      arousal: primaryEmotion.arousal,
      emotion: primaryEmotion, // Primary for backward compatibility
      emotionId: selectedEmotionIds[0],
      emotions, // Array of up to 2 emotions
      emotionIds: selectedEmotionIds,
      notes: notes.trim() || undefined,
    }

    if (existingIndex >= 0) {
      setMoodEntries(prev => prev.map((e, i) => i === existingIndex ? newEntry : e))
    } else {
      setMoodEntries(prev => [...prev, newEntry])
    }

    setShowModal(false)
    setSelectedEmotionIds([])
    setSelectedColor(null)
    setNotes('')
  }

  const getMoodForDate = (date: Date) => {
    return moodEntries.find(e => isSameDay(new Date(e.date), date))
  }

  const handleEmotionSelect = (emotionId: string) => {
    if (selectedEmotionIds.includes(emotionId)) {
      // Remove if already selected
      setSelectedEmotionIds(prev => prev.filter(id => id !== emotionId))
    } else if (selectedEmotionIds.length < 2) {
      // Add if less than 2 selected
      setSelectedEmotionIds(prev => [...prev, emotionId])
      const emotion = getEmotionById(emotionId)
      if (emotion && !selectedColor) {
        setSelectedColor(emotion.color || null)
      }
    }
  }

  const handleRemoveEmotion = (emotionId: string) => {
    setSelectedEmotionIds(prev => prev.filter(id => id !== emotionId))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-3">
            <span className="text-4xl">😊</span>
            <Heart className="text-primary-600 dark:text-primary-400" size={32} />
            Mood Tracker
          </h2>
          <p className="text-gray-600 dark:text-gray-300">Select up to 2 emotions to describe how you're feeling</p>
        </div>
        <button
          onClick={() => {
            setSelectedDate(new Date())
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Add Mood
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
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-soft-lavender/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-soft-lavender/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
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
            <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-300 py-2">
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
            
            // Get emotions to display (support both old and new format)
            const displayEmotions = entry?.emotions || (entry?.emotion ? [entry.emotion] : [])
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => {
                  setSelectedDate(day)
                  setShowModal(true)
                  if (entry) {
                    const emotionIds = entry.emotionIds || (entry.emotionId ? [entry.emotionId] : [])
                    setSelectedEmotionIds(emotionIds)
                    setSelectedColor(displayEmotions[0]?.color || null)
                    setNotes(entry.notes || '')
                  } else {
                    setSelectedEmotionIds([])
                    setSelectedColor(null)
                    setNotes('')
                  }
                }}
                className={`relative p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  entry && displayEmotions.length > 0
                    ? `${getColorClasses(displayEmotions[0].color || 'gray')} border-2`
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                } ${isToday ? 'ring-2 ring-primary-400' : ''} ${
                  !isCurrentMonth ? 'opacity-40' : ''
                }`}
              >
                <span className={`text-sm font-medium ${isToday ? 'font-bold' : ''}`}>
                  {format(day, 'd')}
                </span>
                {displayEmotions.length > 0 && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                    {displayEmotions.slice(0, 2).map((em, idx) => (
                      <span key={idx} className="text-xs">{em.emoji}</span>
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Select up to 2 emotions to describe how you're feeling:</p>

            {/* Selected Emotions Display */}
            {selectedEmotionIds.length > 0 && (
              <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 font-medium">Selected Emotions ({selectedEmotionIds.length}/2):</p>
                <div className="flex flex-wrap gap-2">
                  {selectedEmotionIds.map(emotionId => {
                    const emotion = getEmotionById(emotionId)
                    if (!emotion) return null
                    return (
                      <div
                        key={emotionId}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getColorClasses(emotion.color || 'gray')}`}
                      >
                        <span className="text-xl">{emotion.emoji}</span>
                        <span className="font-semibold">{emotion.label}</span>
                        <button
                          onClick={() => handleRemoveEmotion(emotionId)}
                          className="ml-2 hover:opacity-70 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Color Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {(['yellow', 'red', 'green', 'blue', 'gray'] as const).map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedColor === color
                      ? getColorClasses(color) + ' scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {color === 'yellow' && '😊 Happy'}
                  {color === 'red' && '😰 Stressed'}
                  {color === 'green' && '😌 Calm'}
                  {color === 'blue' && '😔 Low'}
                  {color === 'gray' && '😐 Neutral'}
                </button>
              ))}
            </div>

            {/* Emotion Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6 max-h-96 overflow-y-auto">
              {(selectedColor 
                ? emotionsByColor[selectedColor] 
                : EMOTIONS
              ).map(emotion => {
                const emotionId = `${emotion.emoji}-${emotion.label}`
                const isSelected = selectedEmotionIds.includes(emotionId)
                const isDisabled = !isSelected && selectedEmotionIds.length >= 2
                return (
                  <button
                    key={emotionId}
                    onClick={() => handleEmotionSelect(emotionId)}
                    disabled={isDisabled}
                    className={`p-4 rounded-xl transition-all duration-200 text-center ${
                      isSelected
                        ? `${getColorClasses(emotion.color || 'gray')} scale-105 ring-4 ring-primary-200 dark:ring-primary-800`
                        : isDisabled
                        ? `${getColorClasses(emotion.color || 'gray')} opacity-30 cursor-not-allowed`
                        : `${getColorClasses(emotion.color || 'gray')} opacity-70 hover:opacity-100 hover:scale-105`
                    }`}
                  >
                    <div className="text-3xl mb-2">{emotion.emoji}</div>
                    <div className="text-sm font-semibold">{emotion.label}</div>
                  </button>
                )
              })}
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedEmotionIds([])
                  setSelectedColor(null)
                  setNotes('')
                }}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={selectedEmotionIds.length === 0}
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

export default MoodTracker
