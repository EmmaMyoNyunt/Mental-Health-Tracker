import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, startOfWeek, endOfWeek } from 'date-fns'
import { Calendar as CalendarIcon, Filter } from 'lucide-react'
import { MoodEntry, StressEntry, SleepEntry, AppetiteEntry, ExerciseEntry, CalendarView, CalendarFilter } from '../types'
import { getColorClasses } from '../utils/emotions'

interface CalendarProps {
  moodEntries: MoodEntry[]
  stressEntries: StressEntry[]
  sleepEntries: SleepEntry[]
  appetiteEntries: AppetiteEntry[]
  exerciseEntries: ExerciseEntry[]
}

const movementMinutesForDate = (entries: ExerciseEntry[], dateStr: string) =>
  entries.filter((e) => e.date === dateStr).reduce((s, e) => s + e.minutes, 0)

const Calendar = ({ moodEntries, stressEntries, sleepEntries, appetiteEntries, exerciseEntries }: CalendarProps) => {
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
  const paddingDays = Array.from({ length: firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 }, () => null)

  const getDayData = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return {
      mood: moodEntries.find(e => e.date === dateStr),
      stress: stressEntries.find(e => e.date === dateStr),
      sleep: sleepEntries.find(e => e.date === dateStr),
      appetite: appetiteEntries.find(e => e.date === dateStr),
      movementMinutes: movementMinutesForDate(exerciseEntries, dateStr),
    }
  }

  const daysToShow = view === 'monthly' ? monthDays : weekDays

  return (
    <div className="page-shell animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="mb-2 flex items-center gap-3 text-2xl font-bold text-heading">
            <CalendarIcon className="text-primary-600 dark:text-primary-400" size={28} />
            Calendar
          </h2>
          <p className="text-muted">View mood, stress, sleep, appetite, and movement together</p>
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
              className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-stone-800 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-100"
            >
              <option value="all">All trackers</option>
              <option value="mood">Mood</option>
              <option value="stress">Stress</option>
              <option value="sleep">Sleep</option>
              <option value="appetite">Appetite</option>
              <option value="exercise">Movement</option>
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
              className="rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-stone-200/60 dark:text-gray-400 dark:hover:bg-slate-800/60"
            >
              Prev
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
              className="rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-stone-200/60 dark:text-gray-400 dark:hover:bg-slate-800/60"
            >
              Next
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

            const showMood = (filter === 'all' || filter === 'mood') && dayData.mood
            const showStress = (filter === 'all' || filter === 'stress') && dayData.stress
            const showSleep = (filter === 'all' || filter === 'sleep') && dayData.sleep
            const showAppetite = (filter === 'all' || filter === 'appetite') && dayData.appetite
            const showMovement =
              (filter === 'all' || filter === 'exercise') && dayData.movementMinutes > 0

            return (
              <div
                key={day.toISOString()}
                className={`relative min-h-[100px] rounded-lg border-2 p-2 transition-all ${
                  isToday
                    ? 'border-primary-500 bg-primary-100/70 ring-2 ring-primary-400/90 dark:border-primary-400 dark:bg-slate-800 dark:ring-2 dark:ring-primary-500'
                    : 'border-transparent bg-stone-100/75 dark:bg-slate-800/50'
                } ${!isCurrentMonth ? 'opacity-40' : ''}`}
              >
                <span
                  className={`text-sm font-medium ${isToday ? 'font-bold text-primary-900 dark:text-stone-50' : 'text-heading'}`}
                >
                  {format(day, 'd')}
                </span>
                <div className="mt-2 space-y-1">
                  {showMood && dayData.mood && (
                    (dayData.mood.emotions && dayData.mood.emotions.length > 0) ? (
                      <div className="space-y-1">
                        {dayData.mood.emotions.map((emotion, idx) => (
                          <div key={idx} className={`text-xs p-1 rounded ${getColorClasses(emotion.color || 'gray')}`}>
                            {emotion.label}
                          </div>
                        ))}
                      </div>
                    ) : dayData.mood.emotion ? (
                      <div className={`text-xs p-1 rounded ${getColorClasses(dayData.mood.emotion.color || 'gray')}`}>
                        {dayData.mood.emotion.label}
                      </div>
                    ) : null
                  )}
                  {showStress && (
                    <div className="text-xs p-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                      Stress: {dayData.stress?.stressLevel}
                    </div>
                  )}
                  {showSleep && (
                    <div className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      Sleep: {dayData.sleep?.hours}h
                    </div>
                  )}
                  {showAppetite && (
                    <div className="text-xs p-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      Appetite: {dayData.appetite?.waterIntake}
                    </div>
                  )}
                  {showMovement && (
                    <div className="rounded bg-teal-100 p-1 text-xs text-teal-800 dark:bg-teal-950/40 dark:text-teal-200">
                      Movement: {dayData.movementMinutes} min
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

