import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, startOfWeek, endOfWeek, eachWeekOfInterval } from 'date-fns'
import { Calendar as CalendarIcon, Filter } from 'lucide-react'
import { MoodEntry, StressEntry, SleepEntry, AppetiteEntry, CalendarView, CalendarFilter } from '../types'
import { getColorClasses } from '../utils/emotions'

interface CalendarProps {
  moodEntries: MoodEntry[]
  stressEntries: StressEntry[]
  sleepEntries: SleepEntry[]
  appetiteEntries: AppetiteEntry[]
}

const Calendar = ({ moodEntries, stressEntries, sleepEntries, appetiteEntries }: CalendarProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>('monthly')
  const [filter, setFilter] = useState<CalendarFilter>('all')

  const today = new Date()
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const firstDayOfWeek = monthStart.getDay()
  const paddingDays = Array.from({ length: firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 }, (_, i) => null)

  const getDayData = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return {
      mood: moodEntries.find(e => isSameDay(new Date(e.date), date)),
      stress: stressEntries.find(e => isSameDay(new Date(e.date), date)),
      sleep: sleepEntries.find(e => isSameDay(new Date(e.date), date)),
      appetite: appetiteEntries.find(e => isSameDay(new Date(e.date), date)),
    }
  }

  const daysToShow = view === 'monthly' ? monthDays : weekDays

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-3">
            <span className="text-4xl">📅</span>
            <CalendarIcon className="text-primary-600 dark:text-primary-400" size={32} />
            Calendar
          </h2>
          <p className="text-gray-600 dark:text-gray-400">View all your tracking data in one place</p>
        </div>
      </div>

      {/* View and Filter Controls */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setView('monthly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'monthly'
                  ? 'bg-primary-600 dark:bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setView('weekly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'weekly'
                  ? 'bg-primary-600 dark:bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Weekly
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-600 dark:text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as CalendarFilter)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              <option value="all">All Trackers</option>
              <option value="mood">Mood</option>
              <option value="stress">Stress</option>
              <option value="sleep">Sleep</option>
              <option value="appetite">Appetite</option>
            </select>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {view === 'monthly' 
              ? format(selectedDate, 'MMMM yyyy')
              : `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
            }
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (view === 'monthly') {
                  setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))
                } else {
                  setSelectedDate(new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000))
                }
              }}
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
              onClick={() => {
                if (view === 'monthly') {
                  setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))
                } else {
                  setSelectedDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000))
                }
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-soft-lavender/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
          {view === 'monthly' && paddingDays.map((_, idx) => (
            <div key={`pad-${idx}`} />
          ))}
          {daysToShow.map(day => {
            const isToday = isSameDay(day, today)
            const isCurrentMonth = view === 'weekly' || isSameMonth(day, selectedDate)
            const dayData = getDayData(day)
            const hasData = dayData.mood || dayData.stress || dayData.sleep || dayData.appetite

            const showMood = (filter === 'all' || filter === 'mood') && dayData.mood
            const showStress = (filter === 'all' || filter === 'stress') && dayData.stress
            const showSleep = (filter === 'all' || filter === 'sleep') && dayData.sleep
            const showAppetite = (filter === 'all' || filter === 'appetite') && dayData.appetite

            return (
              <div
                key={day.toISOString()}
                className={`relative p-2 rounded-lg border-2 transition-all ${
                  isToday
                    ? 'ring-2 ring-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'bg-gray-50 dark:bg-gray-700 border-transparent'
                } ${!isCurrentMonth ? 'opacity-40' : ''} min-h-[100px]`}
              >
                <span className={`text-sm font-medium ${isToday ? 'font-bold' : ''}`}>
                  {format(day, 'd')}
                </span>
                <div className="mt-2 space-y-1">
                  {showMood && dayData.mood && (
                    (dayData.mood.emotions && dayData.mood.emotions.length > 0) ? (
                      <div className="space-y-1">
                        {dayData.mood.emotions.map((emotion, idx) => (
                          <div key={idx} className={`text-xs p-1 rounded ${getColorClasses(emotion.color || 'gray')}`}>
                            {emotion.emoji} {emotion.label}
                          </div>
                        ))}
                      </div>
                    ) : dayData.mood.emotion ? (
                      <div className={`text-xs p-1 rounded ${getColorClasses(dayData.mood.emotion.color || 'gray')}`}>
                        {dayData.mood.emotion.emoji} {dayData.mood.emotion.label}
                      </div>
                    ) : null
                  )}
                  {showStress && (
                    <div className="text-xs p-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                      😰 Stress: {dayData.stress?.stressLevel}
                    </div>
                  )}
                  {showSleep && (
                    <div className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      😴 {dayData.sleep?.hours}h
                    </div>
                  )}
                  {showAppetite && (
                    <div className="text-xs p-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      🍽️ {dayData.appetite?.waterIntake}💧
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Calendar

