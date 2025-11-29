import { useMemo } from 'react'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { TrendingUp, Calendar, Heart } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { MoodEntry, JournalEntry } from '../types'

interface InsightsProps {
  moodEntries: MoodEntry[]
  journalEntries: JournalEntry[]
}

const Insights = ({ moodEntries, journalEntries }: InsightsProps) => {
  const last30Days = useMemo(() => {
    const days = []
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const entry = moodEntries.find(e => isSameDay(new Date(e.date), date))
      days.push({
        date: format(date, 'MMM d'),
        mood: entry?.mood || null,
        day: format(date, 'EEE'),
      })
    }
    return days
  }, [moodEntries])

  const weeklyData = useMemo(() => {
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

    return weekDays.map(day => {
      const entry = moodEntries.find(e => isSameDay(new Date(e.date), day))
      return {
        day: format(day, 'EEE'),
        mood: entry?.mood || 0,
      }
    })
  }, [moodEntries])

  const moodDistribution = useMemo(() => {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    moodEntries.forEach(entry => {
      dist[entry.mood]++
    })
    return [
      { mood: '1', count: dist[1] },
      { mood: '2', count: dist[2] },
      { mood: '3', count: dist[3] },
      { mood: '4', count: dist[4] },
      { mood: '5', count: dist[5] },
    ]
  }, [moodEntries])

  const averageMood = useMemo(() => {
    if (moodEntries.length === 0) return 0
    return moodEntries.reduce((sum, e) => sum + e.mood, 0) / moodEntries.length
  }, [moodEntries])

  const streak = useMemo(() => {
    if (moodEntries.length === 0) return 0
    const sorted = [...moodEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    let count = 0
    let currentDate = new Date()
    
    for (const entry of sorted) {
      const entryDate = new Date(entry.date)
      if (isSameDay(entryDate, currentDate) || 
          isSameDay(entryDate, subDays(currentDate, count))) {
        count++
        currentDate = entryDate
      } else {
        break
      }
    }
    return count
  }, [moodEntries])

  const chartData = last30Days.filter(d => d.mood !== null).map(d => ({
    date: d.date,
    mood: d.mood,
  }))

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <TrendingUp className="text-primary-600" size={32} />
          Insights
        </h2>
        <p className="text-gray-600">Analyze your mental health patterns and trends</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Heart className="text-primary-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-gray-800">
              {averageMood > 0 ? averageMood.toFixed(1) : '—'}
            </span>
          </div>
          <h3 className="text-gray-600 font-medium">Average Mood</h3>
          <p className="text-sm text-gray-500 mt-1">Across all entries</p>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-soft-mint rounded-xl">
              <Calendar className="text-emerald-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-gray-800">{streak}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Day Streak</h3>
          <p className="text-sm text-gray-500 mt-1">Consecutive tracking days</p>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-soft-peach rounded-xl">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-gray-800">
              {journalEntries.length}
            </span>
          </div>
          <h3 className="text-gray-600 font-medium">Journal Entries</h3>
          <p className="text-sm text-gray-500 mt-1">Total reflections</p>
        </div>
      </div>

      {/* 30-Day Trend */}
      {chartData.length > 0 && (
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">30-Day Mood Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[1, 5]}
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weekly Overview */}
      {weeklyData.some(d => d.mood > 0) && (
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">This Week</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 5]}
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
              <Bar 
                dataKey="mood" 
                fill="#0ea5e9" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Mood Distribution */}
      {moodDistribution.some(d => d.count > 0) && (
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Mood Distribution</h3>
          <div className="space-y-4">
            {moodDistribution.map(({ mood, count }) => {
              const total = moodDistribution.reduce((sum, d) => sum + d.count, 0)
              const percentage = total > 0 ? (count / total) * 100 : 0
              const moodLabels = { '1': 'Poor', '2': 'Not Great', '3': 'Okay', '4': 'Good', '5': 'Excellent' }
              const moodColors = {
                '1': 'bg-red-500',
                '2': 'bg-orange-500',
                '3': 'bg-yellow-500',
                '4': 'bg-green-500',
                '5': 'bg-emerald-500',
              }
              
              return (
                <div key={mood} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 w-8">{mood}</span>
                      <span className="text-sm text-gray-600">{moodLabels[mood as keyof typeof moodLabels]}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{count} entries</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${moodColors[mood as keyof typeof moodColors]} transition-all duration-500 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {moodEntries.length === 0 && (
        <div className="glass-effect rounded-2xl p-12 text-center">
          <TrendingUp className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg mb-2">No data yet</p>
          <p className="text-gray-400 text-sm">Start tracking your mood to see insights</p>
        </div>
      )}
    </div>
  )
}

export default Insights

