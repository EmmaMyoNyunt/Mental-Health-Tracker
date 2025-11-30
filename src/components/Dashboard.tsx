import { Calendar, Heart, BookOpen, TrendingUp, AlertCircle, UtensilsCrossed, Droplet, Moon } from 'lucide-react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { MoodEntry, JournalEntry, StressEntry, AppetiteEntry, SleepEntry } from '../types'
import { usePet } from '../contexts/PetContext'
import { getColorClasses } from '../utils/emotions'

interface DashboardProps {
  moodEntries: MoodEntry[]
  journalEntries: JournalEntry[]
  stressEntries: StressEntry[]
  appetiteEntries: AppetiteEntry[]
  sleepEntries: SleepEntry[]
}

const Dashboard = ({ moodEntries, journalEntries, stressEntries, appetiteEntries, sleepEntries }: DashboardProps) => {
  const { preferences } = usePet()
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const todayMood = moodEntries.find(entry => 
    isSameDay(new Date(entry.date), today)
  )

  const todayStress = stressEntries.find(entry =>
    isSameDay(new Date(entry.date), today)
  )

  const todayAppetite = appetiteEntries.find(entry =>
    isSameDay(new Date(entry.date), today)
  )

  const todaySleep = sleepEntries.find(entry =>
    isSameDay(new Date(entry.date), today)
  )

  const recentJournals = journalEntries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  // Keep for backward compatibility but we'll use full data in the display

  const averageMood = moodEntries.length > 0
    ? moodEntries.reduce((sum, e) => sum + e.mood, 0) / moodEntries.length
    : 0

  const averageStress = stressEntries.length > 0
    ? stressEntries.reduce((sum, e) => sum + e.stressLevel, 0) / stressEntries.length
    : 0

  const moodColors = {
    1: 'bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    2: 'bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    3: 'bg-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    4: 'bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    5: 'bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  }

  const stressColors = {
    1: 'bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    2: 'bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    3: 'bg-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    4: 'bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    5: 'bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
          <span>🌱</span>
          Welcome Back{preferences.petName ? `, ${preferences.petName}` : ''}!
        </h2>
        <p className="text-gray-600 dark:text-gray-300">Here's your mental health garden overview 🌸</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <Heart className="text-primary-600 dark:text-primary-400" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {moodEntries.length}
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-300 font-medium">Mood Entries</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total tracked</p>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {stressEntries.length}
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-300 font-medium">Stress Entries</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total tracked</p>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-soft-mint dark:bg-emerald-900/30 rounded-xl">
              <BookOpen className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {journalEntries.length}
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-300 font-medium">Journal Entries</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Thoughts recorded</p>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-soft-peach dark:bg-orange-900/30 rounded-xl">
              <TrendingUp className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {averageMood > 0 ? averageMood.toFixed(1) : '—'}
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-300 font-medium">Avg Mood</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This month</p>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Today's Mood */}
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span>😊</span>
            Today's Mood
          </h3>
          {todayMood ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {todayMood.emotions && todayMood.emotions.length > 0 ? (
                  <>
                    <div className="flex gap-2">
                      {todayMood.emotions.map((emotion, idx) => (
                        <div key={idx} className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${getColorClasses(emotion.color || 'gray')}`}>
                          {emotion.emoji}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-200 font-medium">
                        {todayMood.emotions.map(e => e.label).join(' + ')}
                      </p>
                      {todayMood.notes && (
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{todayMood.notes}</p>
                      )}
                    </div>
                  </>
                ) : todayMood.emotion ? (
                  <>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${getColorClasses(todayMood.emotion.color || 'gray')}`}>
                      {todayMood.emotion.emoji}
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-200 font-medium">
                        {todayMood.emotion.label}
                      </p>
                      {todayMood.notes && (
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{todayMood.notes}</p>
                      )}
                    </div>
                  </>
                ) : todayMood.mood ? (
                  <>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${moodColors[todayMood.mood]}`}>
                      {todayMood.mood}
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-200 font-medium">
                        {todayMood.mood === 5 ? 'Excellent 🌟' :
                         todayMood.mood === 4 ? 'Good 😊' :
                         todayMood.mood === 3 ? 'Okay 😐' :
                         todayMood.mood === 2 ? 'Not Great 😔' : 'Poor 😢'}
                      </p>
                      {todayMood.notes && (
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{todayMood.notes}</p>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-300 italic">No mood entry for today yet 🌱</p>
          )}
        </div>

        {/* Today's Stress */}
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span>😰</span>
            Today's Stress
          </h3>
          {todayStress ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${stressColors[todayStress.stressLevel]}`}>
                  {todayStress.stressLevel}
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {todayStress.stressLevel === 1 ? 'Very Low 🌿' :
                     todayStress.stressLevel === 2 ? 'Low 🍃' :
                     todayStress.stressLevel === 3 ? 'Moderate 🟡' :
                     todayStress.stressLevel === 4 ? 'High 🟠' : 'Very High 🔴'}
                  </p>
                  {todayStress.triggers && todayStress.triggers.length > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                      Triggers: {todayStress.triggers.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-300 italic">No stress entry for today yet 🌱</p>
          )}
        </div>

        {/* Today's Appetite */}
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span>🍽️</span>
            Today's Appetite
          </h3>
          {todayAppetite ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Droplet className="text-blue-600 dark:text-blue-400" size={24} />
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {todayAppetite.waterIntake} {todayAppetite.waterIntake === 1 ? 'glass' : 'glasses'} 💧
                  </p>
                </div>
              </div>
              {todayAppetite.meals && todayAppetite.meals.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {todayAppetite.meals.length} {todayAppetite.meals.length === 1 ? 'meal' : 'meals'} logged
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-300 italic">No appetite entry for today yet 🌱</p>
          )}
        </div>

        {/* Today's Sleep */}
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span>😴</span>
            Today's Sleep
          </h3>
          {todaySleep ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Moon className="text-blue-600 dark:text-blue-400" size={24} />
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {todaySleep.hours}h slept 🌙
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Quality: {todaySleep.quality === 5 ? 'Excellent' : todaySleep.quality === 4 ? 'Very Good' : todaySleep.quality === 3 ? 'Good' : todaySleep.quality === 2 ? 'Fair' : 'Poor'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-300 italic">No sleep entry for today yet 🌱</p>
          )}
        </div>
      </div>

      {/* This Week Overview - All Data */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">This Week 🌸</h3>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, idx) => {
            const dayMood = moodEntries.find(e => isSameDay(new Date(e.date), day))
            const dayStress = stressEntries.find(e => isSameDay(new Date(e.date), day))
            const daySleep = sleepEntries.find(e => isSameDay(new Date(e.date), day))
            const dayAppetite = appetiteEntries.find(e => isSameDay(new Date(e.date), day))
            
            return (
              <div key={idx} className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 font-medium">
                  {format(day, 'EEE')}
                </p>
                <div className="space-y-1">
                  {dayMood ? (
                    (dayMood.emotions && dayMood.emotions.length > 0) ? (
                      <div className="flex justify-center gap-0.5">
                        {dayMood.emotions.slice(0, 2).map((emotion, idx) => (
                          <div key={idx} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getColorClasses(emotion.color || 'gray')}`}>
                            {emotion.emoji}
                          </div>
                        ))}
                      </div>
                    ) : dayMood.emotion ? (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto text-lg ${getColorClasses(dayMood.emotion.color || 'gray')}`}>
                        {dayMood.emotion.emoji}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 mx-auto flex items-center justify-center">
                        <span className="text-gray-400 dark:text-gray-500 text-xs">—</span>
                      </div>
                    )
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 mx-auto flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500 text-xs">—</span>
                    </div>
                  )}
                  <div className="flex justify-center gap-1 mt-1">
                    {dayStress && (
                      <span className="text-xs" title={`Stress: ${dayStress.stressLevel}`}>😰</span>
                    )}
                    {daySleep && (
                      <span className="text-xs" title={`Sleep: ${daySleep.hours}h`}>😴</span>
                    )}
                    {dayAppetite && (
                      <span className="text-xs" title={`Water: ${dayAppetite.waterIntake}💧`}>🍽️</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Journal Entries */}
      {recentJournals.length > 0 && (
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span>📔</span>
            Recent Journal Entries
          </h3>
          <div className="space-y-4">
            {recentJournals.map((entry) => (
              <div key={entry.id} className="border-l-4 border-primary-400 dark:border-primary-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{entry.title}</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-300">
                    {format(new Date(entry.date), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
