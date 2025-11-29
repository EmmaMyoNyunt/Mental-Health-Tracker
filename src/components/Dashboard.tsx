import { Calendar, Heart, BookOpen, TrendingUp } from 'lucide-react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { MoodEntry, JournalEntry } from '../types'

interface DashboardProps {
  moodEntries: MoodEntry[]
  journalEntries: JournalEntry[]
}

const Dashboard = ({ moodEntries, journalEntries }: DashboardProps) => {
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const todayMood = moodEntries.find(entry => 
    isSameDay(new Date(entry.date), today)
  )

  const recentJournals = journalEntries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  const weeklyMoods = weekDays.map(day => {
    const entry = moodEntries.find(e => isSameDay(new Date(e.date), day))
    return { day, mood: entry?.mood }
  })

  const averageMood = moodEntries.length > 0
    ? moodEntries.reduce((sum, e) => sum + e.mood, 0) / moodEntries.length
    : 0

  const moodColors = {
    1: 'bg-red-200 text-red-700',
    2: 'bg-orange-200 text-orange-700',
    3: 'bg-yellow-200 text-yellow-700',
    4: 'bg-green-200 text-green-700',
    5: 'bg-emerald-200 text-emerald-700',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Here's your mental health overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Heart className="text-primary-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {moodEntries.length}
            </span>
          </div>
          <h3 className="text-gray-600 font-medium">Mood Entries</h3>
          <p className="text-sm text-gray-500 mt-1">Total tracked</p>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-soft-mint rounded-xl">
              <BookOpen className="text-emerald-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {journalEntries.length}
            </span>
          </div>
          <h3 className="text-gray-600 font-medium">Journal Entries</h3>
          <p className="text-sm text-gray-500 mt-1">Thoughts recorded</p>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-soft-peach rounded-xl">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {averageMood > 0 ? averageMood.toFixed(1) : '—'}
            </span>
          </div>
          <h3 className="text-gray-600 font-medium">Average Mood</h3>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </div>
      </div>

      {/* Today's Mood & Weekly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Mood */}
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Today's Mood
          </h3>
          {todayMood ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${moodColors[todayMood.mood]}`}>
                  {todayMood.mood}
                </div>
                <div>
                  <p className="text-gray-700 font-medium">
                    {todayMood.mood === 5 ? 'Excellent' :
                     todayMood.mood === 4 ? 'Good' :
                     todayMood.mood === 3 ? 'Okay' :
                     todayMood.mood === 2 ? 'Not Great' : 'Poor'}
                  </p>
                  {todayMood.notes && (
                    <p className="text-sm text-gray-500 mt-1">{todayMood.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">No mood entry for today yet</p>
          )}
        </div>

        {/* Weekly Mood Overview */}
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">This Week</h3>
          <div className="grid grid-cols-7 gap-2">
            {weeklyMoods.map(({ day, mood }, idx) => (
              <div key={idx} className="text-center">
                <p className="text-xs text-gray-500 mb-2">
                  {format(day, 'EEE')}
                </p>
                {mood ? (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto font-semibold ${moodColors[mood]}`}>
                    {mood}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 mx-auto flex items-center justify-center">
                    <span className="text-gray-300">—</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Journal Entries */}
      {recentJournals.length > 0 && (
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen size={20} />
            Recent Journal Entries
          </h3>
          <div className="space-y-4">
            {recentJournals.map((entry) => (
              <div key={entry.id} className="border-l-4 border-primary-400 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-800">{entry.title}</h4>
                  <span className="text-xs text-gray-500">
                    {format(new Date(entry.date), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
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

