import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, TrendingUp, AlertCircle, Footprints, ArrowRight } from 'lucide-react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { MoodEntry, JournalEntry, StressEntry, AppetiteEntry, SleepEntry, ExerciseEntry } from '../types'
import { usePet } from '../contexts/PetContext'

interface DashboardProps {
  moodEntries: MoodEntry[]
  journalEntries: JournalEntry[]
  stressEntries: StressEntry[]
  appetiteEntries: AppetiteEntry[]
  sleepEntries: SleepEntry[]
  exerciseEntries: ExerciseEntry[]
}

type HubTab = 'overview' | 'today' | 'timeline'

const movementMinutesOn = (entries: ExerciseEntry[], day: Date) =>
  entries
    .filter((e) => isSameDay(new Date(`${e.date}T12:00:00`), day))
    .reduce((s, e) => s + e.minutes, 0)

const Dashboard = ({ moodEntries, journalEntries, stressEntries, appetiteEntries, sleepEntries, exerciseEntries }: DashboardProps) => {
  const { preferences } = usePet()
  const [activeTab, setActiveTab] = useState<HubTab>('overview')
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const todayMood = moodEntries.find((entry) => isSameDay(new Date(entry.date), today))
  const todayStress = stressEntries.find((entry) => isSameDay(new Date(entry.date), today))
  const todayAppetite = appetiteEntries.find((entry) => isSameDay(new Date(entry.date), today))
  const todaySleep = sleepEntries.find((entry) => isSameDay(new Date(entry.date), today))
  const todayMovementMinutes = movementMinutesOn(exerciseEntries, today)

  const averageMood = moodEntries.length > 0
    ? moodEntries.reduce((sum, e) => sum + (e.mood || 0), 0) / moodEntries.length
    : 0

  const recentJournals = [...journalEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)

  const timelineItems = useMemo(() => {
    const dateStr = format(today, 'yyyy-MM-dd')
    const items: { label: string; value: string; route: string }[] = []

    if (todayMood) {
      const moodLabel = todayMood.emotions?.map((e) => e.label).join(' + ')
        || todayMood.emotion?.label
        || (todayMood.mood ? `Mood ${todayMood.mood}/5` : 'Logged')
      items.push({ label: 'Mood', value: moodLabel, route: '/mood' })
    }
    if (todayStress) {
      items.push({ label: 'Stress', value: `Level ${todayStress.stressLevel}/5`, route: '/stress' })
    }
    if (todaySleep) {
      items.push({ label: 'Sleep', value: `${todaySleep.hours}h · quality ${todaySleep.quality}/5`, route: '/sleep' })
    }
    if (todayAppetite) {
      items.push({ label: 'Appetite', value: `${todayAppetite.waterIntake} glasses · ${todayAppetite.meals.length} meals`, route: '/appetite' })
    }
    if (todayMovementMinutes > 0) {
      items.push({ label: 'Movement', value: `${todayMovementMinutes} min`, route: '/movement' })
    }

    const todayJournal = journalEntries.find((entry) => entry.date === dateStr)
    if (todayJournal) {
      items.push({ label: 'Journal', value: todayJournal.title, route: '/journal' })
    }

    return items
  }, [today, todayMood, todayStress, todaySleep, todayAppetite, todayMovementMinutes, journalEntries])

  const navTabs: { id: HubTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'today', label: 'Today' },
    { id: 'timeline', label: 'Timeline' },
  ]

  return (
    <div className="page-shell animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-r from-white/85 via-stone-50 to-teal-50/40 p-6 shadow-card dark:border-slate-700/70 dark:from-slate-900/85 dark:via-slate-900 dark:to-teal-950/20 dark:shadow-card-dark">
        <div className="absolute -right-8 -top-10 h-44 w-44 rounded-full bg-primary-400/15 blur-3xl dark:bg-primary-500/10" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-heading">
              <span>🌱</span>
              Welcome back{preferences.petName ? `, ${preferences.petName}` : ''}.
            </h2>
            <p className="text-body max-w-2xl">
              Your central hub for wellbeing. Switch sections below to view your bento overview, today snapshot, and daily timeline.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'surface-chip text-muted hover:text-heading'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="panel-grid">
          <div className="glass-effect rounded-2xl p-5 card-hover xl:col-span-7">
            <h3 className="mb-4 text-lg font-semibold text-heading">Weekly activity strip</h3>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const dayMood = moodEntries.find((e) => isSameDay(new Date(e.date), day))
                const dayStress = stressEntries.find((e) => isSameDay(new Date(e.date), day))
                const daySleep = sleepEntries.find((e) => isSameDay(new Date(e.date), day))
                const dayAppetite = appetiteEntries.find((e) => isSameDay(new Date(e.date), day))
                const dayMove = movementMinutesOn(exerciseEntries, day)
                return (
                  <div key={day.toISOString()} className="rounded-xl border border-stone-200/70 bg-white/60 p-2 text-center dark:border-slate-700/70 dark:bg-slate-800/50">
                    <p className="text-xs font-medium text-muted">{format(day, 'EEE')}</p>
                    <p className="my-1 text-sm font-semibold text-heading">{format(day, 'd')}</p>
                    <div className="flex flex-wrap justify-center gap-1 text-[10px] text-faint">
                      {dayMood && <span>M</span>}
                      {dayStress && <span>S</span>}
                      {daySleep && <span>Sl</span>}
                      {dayAppetite && <span>A</span>}
                      {dayMove > 0 && <span>Mo</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-5 card-hover xl:col-span-5">
            <h3 className="mb-4 text-lg font-semibold text-heading">Key metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="surface-chip rounded-xl p-3">
                <div className="flex items-center gap-2 text-muted"><Heart size={16} /> Mood logs</div>
                <p className="mt-1 text-xl font-bold text-heading">{moodEntries.length}</p>
              </div>
              <div className="surface-chip rounded-xl p-3">
                <div className="flex items-center gap-2 text-muted"><AlertCircle size={16} /> Stress logs</div>
                <p className="mt-1 text-xl font-bold text-heading">{stressEntries.length}</p>
              </div>
              <div className="surface-chip rounded-xl p-3">
                <div className="flex items-center gap-2 text-muted"><Footprints size={16} /> Movement</div>
                <p className="mt-1 text-xl font-bold text-heading">{exerciseEntries.length}</p>
              </div>
              <div className="surface-chip rounded-xl p-3">
                <div className="flex items-center gap-2 text-muted"><TrendingUp size={16} /> Avg mood</div>
                <p className="mt-1 text-xl font-bold text-heading">{averageMood > 0 ? averageMood.toFixed(1) : '—'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'today' && (
        <div className="panel-grid">
          <div className="glass-effect rounded-2xl p-5 card-hover xl:col-span-3">
            <h3 className="mb-3 text-lg font-semibold text-heading">Mood</h3>
            <p className="text-sm text-muted">
              {todayMood
                ? (todayMood.emotions?.map((e) => e.label).join(' + ') || todayMood.emotion?.label || `Mood ${todayMood.mood}/5`)
                : 'No entry yet'}
            </p>
          </div>
          <div className="glass-effect rounded-2xl p-5 card-hover xl:col-span-3">
            <h3 className="mb-3 text-lg font-semibold text-heading">Stress</h3>
            <p className="text-sm text-muted">{todayStress ? `Level ${todayStress.stressLevel}/5` : 'No entry yet'}</p>
          </div>
          <div className="glass-effect rounded-2xl p-5 card-hover xl:col-span-3">
            <h3 className="mb-3 text-lg font-semibold text-heading">Sleep</h3>
            <p className="text-sm text-muted">{todaySleep ? `${todaySleep.hours}h · quality ${todaySleep.quality}/5` : 'No entry yet'}</p>
          </div>
          <div className="glass-effect rounded-2xl p-5 card-hover xl:col-span-3">
            <h3 className="mb-3 text-lg font-semibold text-heading">Movement</h3>
            <p className="text-sm text-muted">{todayMovementMinutes > 0 ? `${todayMovementMinutes} min` : 'No entry yet'}</p>
          </div>
          <div className="glass-effect rounded-2xl p-5 card-hover xl:col-span-6">
            <h3 className="mb-3 text-lg font-semibold text-heading">Nutrition snapshot</h3>
            <p className="text-sm text-muted">
              {todayAppetite
                ? `${todayAppetite.waterIntake} glasses · ${todayAppetite.meals.length} meals logged`
                : 'No entry yet'}
            </p>
          </div>
          <div className="glass-effect rounded-2xl p-5 card-hover xl:col-span-6">
            <h3 className="mb-3 text-lg font-semibold text-heading">Quick action rail</h3>
            <div className="flex flex-wrap gap-2">
              <Link to="/mood" className="surface-chip rounded-lg px-3 py-2 text-sm text-muted hover:text-heading">Log mood</Link>
              <Link to="/stress" className="surface-chip rounded-lg px-3 py-2 text-sm text-muted hover:text-heading">Log stress</Link>
              <Link to="/movement" className="surface-chip rounded-lg px-3 py-2 text-sm text-muted hover:text-heading">Log movement</Link>
              <Link to="/journal" className="surface-chip rounded-lg px-3 py-2 text-sm text-muted hover:text-heading">Write journal</Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="panel-grid">
          <div className="glass-effect rounded-2xl p-5 card-hover xl:col-span-7">
            <h3 className="mb-4 text-lg font-semibold text-heading">Today timeline</h3>
            {timelineItems.length === 0 ? (
              <p className="text-sm italic text-muted">No logs yet today. Use quick actions to add your first entry.</p>
            ) : (
              <div className="space-y-3">
                {timelineItems.map((item, index) => (
                  <Link
                    key={`${item.label}-${index}`}
                    to={item.route}
                    className="flex items-center justify-between rounded-xl border border-stone-200/70 bg-white/70 px-4 py-3 transition hover:border-primary-300 dark:border-slate-700/70 dark:bg-slate-800/60"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-wide text-faint">{item.label}</p>
                      <p className="text-sm font-medium text-heading">{item.value}</p>
                    </div>
                    <ArrowRight size={16} className="text-muted" />
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="glass-effect rounded-2xl p-5 card-hover xl:col-span-5">
            <h3 className="mb-4 text-lg font-semibold text-heading">Recent journal cards</h3>
            {recentJournals.length === 0 ? (
              <p className="text-sm italic text-muted">No journal entries yet.</p>
            ) : (
              <div className="space-y-3">
                {recentJournals.map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-stone-200/70 bg-white/70 p-3 dark:border-slate-700/70 dark:bg-slate-800/60">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-sm font-semibold text-heading">{entry.title}</p>
                      <span className="text-xs text-faint">{format(new Date(entry.date), 'MMM d')}</span>
                    </div>
                    <p className="line-clamp-2 text-xs text-muted">{entry.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
