import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, AlertCircle, Footprints, ArrowRight, Check, BookOpen, UtensilsCrossed, Moon } from 'lucide-react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import {
  MoodEntry,
  JournalEntry,
  StressEntry,
  AppetiteEntry,
  SleepEntry,
  ExerciseEntry,
} from '../types'
import { usePet } from '../contexts/PetContext'

interface DashboardProps {
  moodEntries: MoodEntry[]
  journalEntries: JournalEntry[]
  stressEntries: StressEntry[]
  appetiteEntries: AppetiteEntry[]
  sleepEntries: SleepEntry[]
  exerciseEntries: ExerciseEntry[]
}

type HubTab = 'todayOverview' | 'timeline'

const movementMinutesOn = (entries: ExerciseEntry[], day: Date) =>
  entries
    .filter((e) => isSameDay(new Date(`${e.date}T12:00:00`), day))
    .reduce((s, e) => s + e.minutes, 0)

const formatExerciseKind = (kind: string) => kind.charAt(0).toUpperCase() + kind.slice(1)

const formatMealType = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

const previewText = (text: string, maxChars: number) => {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= maxChars) return t
  return `${t.slice(0, maxChars).trimEnd()}…`
}

const linkCardClass =
  'glass-effect card-hover block rounded-2xl p-5 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 border border-transparent hover:border-primary-300/70 dark:hover:border-emerald-500/45'

const Dashboard = ({ moodEntries, journalEntries, stressEntries, appetiteEntries, sleepEntries, exerciseEntries }: DashboardProps) => {
  const { preferences } = usePet()
  const [activeTab, setActiveTab] = useState<HubTab>('todayOverview')
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const todayMood = moodEntries.find((entry) => isSameDay(new Date(entry.date), today))
  const todayStress = stressEntries.find((entry) => isSameDay(new Date(entry.date), today))
  const todayAppetite = appetiteEntries.find((entry) => isSameDay(new Date(entry.date), today))
  const todaySleep = sleepEntries.find((entry) => isSameDay(new Date(entry.date), today))
  const todayMovementMinutes = movementMinutesOn(exerciseEntries, today)

  const todayStr = format(today, 'yyyy-MM-dd')
  const journalsToday = journalEntries.filter((e) => e.date === todayStr)

  const journalsTodaySorted = useMemo(() => {
    if (journalsToday.length === 0) return []
    return [...journalsToday].sort((a, b) => {
      const at = new Date(a.createdAt || `${a.date}T12:00:00`).getTime()
      const bt = new Date(b.createdAt || `${b.date}T12:00:00`).getTime()
      return bt - at
    })
  }, [journalsToday])

  const latestJournalToday = journalsTodaySorted[0] ?? null

  const exerciseToday = useMemo(
    () =>
      exerciseEntries
        .filter((e) => e.date === todayStr)
        .sort((a, b) => a.id.localeCompare(b.id)),
    [exerciseEntries, todayStr]
  )

  const recentJournals = [...journalEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)

  const timelineItems = useMemo(() => {
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

    if (latestJournalToday) {
      const journalValue =
        journalsToday.length > 1
          ? `${journalsToday.length} entries · latest: ${latestJournalToday.title}`
          : latestJournalToday.title
      items.push({ label: 'Journal', value: journalValue, route: '/journal' })
    }

    return items
  }, [todayMood, todayStress, todaySleep, todayAppetite, todayMovementMinutes, journalsToday.length, latestJournalToday])

  const navTabs: { id: HubTab; label: string }[] = [
    { id: 'todayOverview', label: "Today's Overview" },
    { id: 'timeline', label: 'Timeline' },
  ]

  return (
    <div className="page-shell animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-400/50 bg-gradient-to-br from-emerald-100/95 via-cyan-100/85 to-fuchsia-100/75 p-6 shadow-lg shadow-emerald-900/10 ring-1 ring-white/60 dark:border-emerald-500/35 dark:bg-gradient-to-br dark:from-slate-950/95 dark:via-emerald-950/75 dark:to-violet-950/55 dark:shadow-lg dark:shadow-emerald-950/30 dark:ring-1 dark:ring-teal-400/15">
        <div className="absolute -right-8 -top-10 h-44 w-44 rounded-full bg-primary-400/15 blur-3xl dark:bg-emerald-500/20" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-heading">
              <span>🌱</span>
              Welcome back{preferences.petName ? `, ${preferences.petName}` : ''}.
            </h2>
            <p className="text-body max-w-2xl">
              Your central hub for wellbeing. Use Today&apos;s Overview for this week and today&apos;s logs, or open Timeline for a focused feed.
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

      {activeTab === 'todayOverview' && (
        <div className="space-y-4">
          <div className="panel-grid">
            <div className="glass-effect card-hover rounded-2xl p-5 xl:col-span-12">
              <h3 className="mb-4 text-lg font-semibold text-heading">Weekly activity strip</h3>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const dayMood = moodEntries.find((e) => isSameDay(new Date(e.date), day))
                  const dayStress = stressEntries.find((e) => isSameDay(new Date(e.date), day))
                  const daySleep = sleepEntries.find((e) => isSameDay(new Date(e.date), day))
                  const dayAppetite = appetiteEntries.find((e) => isSameDay(new Date(e.date), day))
                  const dayMove = movementMinutesOn(exerciseEntries, day)
                  const rows = [
                    { ok: !!dayMood, label: 'Mood' },
                    { ok: !!dayStress, label: 'Stress' },
                    { ok: !!daySleep, label: 'Sleep' },
                    { ok: !!dayAppetite, label: 'Appetite' },
                    { ok: dayMove > 0, label: 'Movement' },
                  ].filter((r) => r.ok)
                  return (
                    <div
                      key={day.toISOString()}
                      className="rounded-xl border border-stone-200/70 bg-white/60 p-2 dark:border-slate-700/70 dark:bg-slate-800/50"
                    >
                      <p className="text-center text-xs font-medium text-muted">{format(day, 'EEE')}</p>
                      <p className="mb-2 text-center text-sm font-semibold text-heading">{format(day, 'd')}</p>
                      {rows.length === 0 ? (
                        <p className="text-center text-[10px] text-faint">—</p>
                      ) : (
                        <ul className="space-y-1 text-[10px] leading-tight">
                          {rows.map((r) => (
                            <li key={r.label} className="flex items-center gap-1.5 text-body">
                              <Check
                                className="h-3 w-3 shrink-0 text-teal-600 dark:text-teal-400"
                                strokeWidth={2.5}
                                aria-hidden
                              />
                              <span>{r.label}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-heading">
              Today · {format(today, 'EEEE, MMM d')}
            </h3>
            <div className="panel-grid">
              <div className="glass-effect card-hover rounded-2xl p-5 xl:col-span-4">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-heading">
                  <Heart className="text-primary-600 dark:text-primary-400" size={18} />
                  Mood
                </h4>
                <p className="text-sm text-muted">
                  {todayMood
                    ? todayMood.emotions?.map((e) => e.label).join(' + ') ||
                      todayMood.emotion?.label ||
                      (todayMood.mood ? `Mood ${todayMood.mood}/5` : 'Logged')
                    : 'No entry yet'}
                </p>
              </div>
              <div className="glass-effect card-hover rounded-2xl p-5 xl:col-span-4">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-heading">
                  <AlertCircle className="text-amber-600 dark:text-amber-400" size={18} />
                  Stress
                </h4>
                <p className="text-sm text-muted">{todayStress ? `Level ${todayStress.stressLevel}/5` : 'No entry yet'}</p>
              </div>
              <div className="glass-effect card-hover rounded-2xl p-5 xl:col-span-4">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-heading">
                  <Moon className="text-indigo-600 dark:text-indigo-400" size={18} />
                  Sleep
                </h4>
                <p className="text-sm text-muted">
                  {todaySleep ? `${todaySleep.hours}h · quality ${todaySleep.quality}/5` : 'No entry yet'}
                </p>
              </div>
              <Link to="/movement" className={`${linkCardClass} xl:col-span-4 group/link`}>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-heading">
                    <Footprints className="text-teal-600 dark:text-teal-400" size={18} />
                    Movement
                  </h4>
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-muted opacity-60 transition group-hover/link:translate-x-0.5 group-hover/link:text-primary-600 dark:group-hover/link:text-primary-400"
                    aria-hidden
                  />
                </div>
                {exerciseToday.length === 0 ? (
                  <p className="text-sm text-muted">No movement logged today. Open Movement to add a log.</p>
                ) : (
                  <ul className="space-y-2 text-sm text-body">
                    {exerciseToday.map((e) => (
                      <li key={e.id} className="border-l-2 border-teal-400/70 pl-2 dark:border-teal-500/50">
                        <span className="font-medium text-heading">
                          {e.minutes} min · {formatExerciseKind(e.kind)}
                        </span>
                        {e.note?.trim() ? (
                          <span className="text-muted"> — {previewText(e.note.trim(), 80)}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
              <Link to="/appetite" className={`${linkCardClass} xl:col-span-4 group/link`}>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-heading">
                    <UtensilsCrossed className="text-orange-600 dark:text-orange-400" size={18} />
                    Appetite
                  </h4>
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-muted opacity-60 transition group-hover/link:translate-x-0.5 group-hover/link:text-primary-600 dark:group-hover/link:text-primary-400"
                    aria-hidden
                  />
                </div>
                {!todayAppetite ? (
                  <p className="text-sm text-muted">No appetite log for today. Open Appetite to add one.</p>
                ) : (
                  <div className="space-y-3 text-sm">
                    <p className="text-body">
                      <span className="font-medium text-heading">Water:</span>{' '}
                      <span className="text-muted">{todayAppetite.waterIntake} glasses</span>
                    </p>
                    {todayAppetite.meals.length > 0 ? (
                      <ul className="space-y-2">
                        {todayAppetite.meals.map((m) => (
                          <li key={m.id} className="border-l-2 border-orange-400/70 pl-2 dark:border-orange-500/50">
                            <span className="font-medium text-heading">
                              {formatMealType(m.type)} · {m.time}
                            </span>
                            <span className="text-muted"> — {previewText(m.description, 90)}</span>
                            {m.rating ? (
                              <span className="ml-1 text-xs text-faint">({m.rating}/5)</span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No meals logged yet today.</p>
                    )}
                    {todayAppetite.notes?.trim() ? (
                      <p className="text-xs text-muted">
                        <span className="font-medium text-heading">Notes:</span> {previewText(todayAppetite.notes.trim(), 120)}
                      </p>
                    ) : null}
                  </div>
                )}
              </Link>
              <Link to="/journal" className={`${linkCardClass} xl:col-span-4 group/link`}>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-heading">
                    <BookOpen className="text-emerald-600 dark:text-emerald-400" size={18} />
                    Journal
                  </h4>
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-muted opacity-60 transition group-hover/link:translate-x-0.5 group-hover/link:text-primary-600 dark:group-hover/link:text-primary-400"
                    aria-hidden
                  />
                </div>
                {journalsTodaySorted.length === 0 ? (
                  <p className="text-sm text-muted">No journal entries today. Open Journal to write one.</p>
                ) : (
                  <ul className="space-y-3">
                    {journalsTodaySorted.map((j) => (
                      <li key={j.id} className="border-l-2 border-emerald-500/60 pl-2 dark:border-emerald-500/45">
                        <p className="font-medium text-heading">{j.title}</p>
                        {j.content.trim() ? (
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted">
                            {j.content.replace(/\s+/g, ' ').trim()}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="panel-grid">
          <div className="glass-effect rounded-2xl p-5 card-hover xl:col-span-7">
            <h3 className="mb-4 text-lg font-semibold text-heading">Today timeline</h3>
            {timelineItems.length === 0 ? (
              <p className="text-sm italic text-muted">No logs yet today. Use the navigation to open a tracker and add your first entry.</p>
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
