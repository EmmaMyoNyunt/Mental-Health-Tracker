import { useMemo } from 'react'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { TrendingUp, Calendar, Heart } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, Cell } from 'recharts'
import { MoodEntry, JournalEntry, StressEntry, AppetiteEntry, SleepEntry } from '../types'

interface InsightsProps {
  moodEntries: MoodEntry[]
  journalEntries: JournalEntry[]
  stressEntries: StressEntry[]
  appetiteEntries: AppetiteEntry[]
  sleepEntries: SleepEntry[]
}

const Insights = ({ moodEntries, journalEntries, stressEntries, appetiteEntries, sleepEntries }: InsightsProps) => {
  const last30Days = useMemo(() => {
    const days = []
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const entry = moodEntries.find(e => isSameDay(new Date(e.date), date))
      // Use old mood scale if available, otherwise convert valence to approximate scale
      let moodValue = null
      if (entry?.mood) {
        moodValue = entry.mood
      } else if (entry?.valence !== undefined) {
        // Convert valence (-2 to 2) to approximate 1-5 scale for chart
        moodValue = Math.round((entry.valence + 2) * 1.25) + 1
        if (moodValue < 1) moodValue = 1
        if (moodValue > 5) moodValue = 5
      }
      days.push({
        date: format(date, 'MMM d'),
        mood: moodValue,
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
      if (!entry) return { day: format(day, 'EEE'), mood: 0 }
      if (entry.mood) return { day: format(day, 'EEE'), mood: entry.mood }
      if (entry.valence !== undefined) {
        const converted = Math.round((entry.valence + 2) * 1.25) + 1
        return { day: format(day, 'EEE'), mood: Math.max(1, Math.min(5, converted)) }
      }
      return { day: format(day, 'EEE'), mood: 0 }
    })
  }, [moodEntries])

  const moodDistribution = useMemo(() => {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    moodEntries.forEach(entry => {
      if (entry.mood) {
        dist[entry.mood]++
      } else if (entry.valence !== undefined) {
        // Convert valence to approximate 1-5 scale
        const converted = Math.round((entry.valence + 2) * 1.25) + 1
        const moodValue = Math.max(1, Math.min(5, converted))
        dist[moodValue as keyof typeof dist]++
      }
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
    const validEntries = moodEntries.filter(e => e.mood || (e.valence !== undefined && e.arousal !== undefined))
    if (validEntries.length === 0) return 0
    const sum = validEntries.reduce((sum, e) => {
      if (e.mood) return sum + e.mood
      // Convert valence to approximate 1-5 scale
      const converted = Math.round((e.valence! + 2) * 1.25) + 1
      return sum + Math.max(1, Math.min(5, converted))
    }, 0)
    return sum / validEntries.length
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

      {/* Arousal-Valence Model Visualization */}
      {moodEntries.filter(e => {
        if (e.emotions && e.emotions.length > 0) return true
        if (e.valence !== undefined && e.arousal !== undefined) return true
        return false
      }).length > 0 && (
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Arousal-Valence Model</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Your emotions plotted by valence (pleasure/displeasure) and arousal (activation level)
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                type="number"
                dataKey="valence"
                domain={[-2.5, 2.5]}
                label={{ value: 'Valence (Negative ← → Positive)', position: 'insideBottom', offset: -5 }}
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                type="number"
                dataKey="arousal"
                domain={[0.5, 5.5]}
                label={{ value: 'Arousal (Low → High)', angle: -90, position: 'insideLeft' }}
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {data.emotion?.emoji} {data.emotion?.label}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Valence: {data.valence} | Arousal: {data.arousal}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {format(new Date(data.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter name="Emotions" data={moodEntries
                .filter(e => {
                  // Include entries with emotions array or single emotion
                  if (e.emotions && e.emotions.length > 0) return true
                  if (e.valence !== undefined && e.arousal !== undefined) return true
                  return false
                })
                .flatMap(e => {
                  // If multiple emotions, create a point for each
                  if (e.emotions && e.emotions.length > 0) {
                    return e.emotions.map(emotion => ({
                      valence: emotion.valence,
                      arousal: emotion.arousal,
                      emotion: emotion,
                      date: e.date,
                    }))
                  }
                  // Single emotion or legacy format
                  return [{
                    valence: e.valence!,
                    arousal: e.arousal!,
                    emotion: e.emotion,
                    date: e.date,
                  }]
                })}
              >
                {moodEntries
                  .filter(e => {
                    if (e.emotions && e.emotions.length > 0) return true
                    if (e.valence !== undefined && e.arousal !== undefined) return true
                    return false
                  })
                  .flatMap((entry, entryIndex) => {
                    const emotions = entry.emotions || (entry.emotion ? [entry.emotion] : [])
                    return emotions.map((emotion, emotionIndex) => {
                      let color = '#94a3b8'
                      if (emotion.valence > 0 && emotion.arousal >= 4) color = '#fbbf24'
                      else if (emotion.valence > 0 && emotion.arousal <= 2) color = '#10b981'
                      else if (emotion.valence < 0 && emotion.arousal >= 4) color = '#ef4444'
                      else if (emotion.valence < 0 && emotion.arousal <= 2) color = '#3b82f6'
                      return <Cell key={`cell-${entryIndex}-${emotionIndex}`} fill={color} />
                    })
                  })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <p className="font-semibold">High Arousal + Positive</p>
              <p className="text-gray-600 dark:text-gray-400">Excited, Happy, Energetic</p>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <p className="font-semibold">High Arousal + Negative</p>
              <p className="text-gray-600 dark:text-gray-400">Anxious, Angry, Stressed</p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <p className="font-semibold">Low Arousal + Positive</p>
              <p className="text-gray-600 dark:text-gray-400">Calm, Content, Peaceful</p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="font-semibold">Low Arousal + Negative</p>
              <p className="text-gray-600 dark:text-gray-400">Sad, Tired, Depressed</p>
            </div>
          </div>
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

