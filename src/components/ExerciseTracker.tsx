import { useMemo, useState } from 'react'
import { format, isSameDay } from 'date-fns'
import { Footprints, Plus, Trash2, Sparkles } from 'lucide-react'
import { ExerciseEntry, ExerciseKind } from '../types'

interface ExerciseTrackerProps {
  exerciseEntries: ExerciseEntry[]
  setExerciseEntries: (entries: ExerciseEntry[] | ((prev: ExerciseEntry[]) => ExerciseEntry[])) => void
}

const KIND_OPTIONS: { id: ExerciseKind; label: string; hint: string }[] = [
  { id: 'walk', label: 'Walk', hint: 'Fresh air & rhythm' },
  { id: 'stretch', label: 'Stretch', hint: 'Release tension' },
  { id: 'dance', label: 'Dance', hint: 'Joyful movement' },
  { id: 'gentle', label: 'Gentle', hint: 'Yoga, slow flow' },
  { id: 'other', label: 'Other', hint: 'Anything that counts' },
]

const MINUTE_PRESETS = [5, 10, 15, 20, 30]

const ExerciseTracker = ({ exerciseEntries, setExerciseEntries }: ExerciseTrackerProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [minutes, setMinutes] = useState(15)
  const [kind, setKind] = useState<ExerciseKind>('walk')
  const [note, setNote] = useState('')
  const [showForm, setShowForm] = useState(false)

  const today = new Date()
  const dateStr = format(selectedDate, 'yyyy-MM-dd')

  const dayEntries = useMemo(
    () => exerciseEntries.filter((e) => e.date === dateStr).sort((a, b) => a.id.localeCompare(b.id)),
    [exerciseEntries, dateStr]
  )

  const dayTotalMinutes = useMemo(() => dayEntries.reduce((s, e) => s + e.minutes, 0), [dayEntries])

  const weekTotal = useMemo(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0, 0)
    return exerciseEntries
      .filter((e) => {
        const d = new Date(`${e.date}T12:00:00`)
        return d >= start && d <= end
      })
      .reduce((s, e) => s + e.minutes, 0)
  }, [exerciseEntries])

  const addEntry = () => {
    const m = Math.min(180, Math.max(1, Math.round(minutes)))
    const entry: ExerciseEntry = {
      id: crypto.randomUUID(),
      date: dateStr,
      minutes: m,
      kind,
      note: note.trim() || undefined,
    }
    setExerciseEntries((prev) => [...prev, entry])
    setNote('')
    setShowForm(false)
  }

  const removeEntry = (id: string) => {
    setExerciseEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="page-shell animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-br from-teal-50/90 via-stone-50 to-cyan-50/80 p-6 shadow-card dark:border-slate-700/80 dark:from-slate-800/90 dark:via-slate-900 dark:to-indigo-950/50 dark:shadow-card-dark">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-400/20 dark:bg-primary-500/10 blur-2xl animate-float-soft pointer-events-none" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-heading flex items-center gap-3">
              <Footprints className="text-teal-600 dark:text-teal-400" size={32} aria-hidden />
              Movement breaks
            </h2>
            <p className="text-muted mt-2 max-w-xl">
              Celebrate small wins.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="surface-chip rounded-2xl px-4 py-3 text-sm text-body">
              <span className="text-faint block text-xs uppercase tracking-wide">Last 7 days</span>
              <span className="text-xl font-bold text-teal-700 dark:text-teal-300">{weekTotal} min</span>
            </div>
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 font-medium text-white shadow-lg transition hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
            >
              <Plus size={20} />
              Log movement
            </button>
          </div>
        </div>
      </div>

      <div className="panel-grid">
        <div className="glass-effect rounded-2xl p-6 card-hover xl:col-span-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl text-heading">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 86400000))}
              className="rounded-lg px-3 py-2 text-muted transition hover:bg-white/60 dark:hover:bg-slate-800/80"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(today)}
              className="rounded-lg px-3 py-2 font-medium text-primary-700 dark:text-primary-300 transition hover:bg-primary-100/80 dark:hover:bg-primary-950/40"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 86400000))}
              className="rounded-lg px-3 py-2 text-muted transition hover:bg-white/60 dark:hover:bg-slate-800/80"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-baseline gap-2">
          <span className="text-faint text-sm">This day</span>
          <span className="text-2xl font-bold text-heading">{dayTotalMinutes}</span>
          <span className="text-muted">minutes logged</span>
          {isSameDay(selectedDate, today) && dayTotalMinutes === 0 && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-medium text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
              <Sparkles size={14} />
              Even 5 minutes counts
            </span>
          )}
        </div>

        {showForm && (
          <div className="mb-6 rounded-2xl border border-teal-200/60 bg-white/60 p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="mb-3 text-sm font-medium text-heading">What did you do?</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {KIND_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setKind(opt.id)}
                  title={opt.hint}
                  className={`rounded-xl border px-3 py-2 text-sm transition ${
                    kind === opt.id
                      ? 'border-teal-500 bg-teal-100 text-teal-900 dark:border-teal-400 dark:bg-teal-950/50 dark:text-teal-100'
                      : 'surface-chip text-body hover:border-teal-300/60 dark:hover:border-teal-700/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="mb-2 text-sm font-medium text-heading">How long?</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {MINUTE_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setMinutes(p)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    minutes === p
                      ? 'bg-primary-600 text-white dark:bg-primary-500'
                      : 'surface-chip text-body'
                  }`}
                >
                  {p} min
                </button>
              ))}
              <label className="flex items-center gap-2 text-sm text-muted">
                <span>Custom</span>
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value) || 0)}
                  className="w-20 rounded-lg border border-stone-200 bg-white px-2 py-1 text-stone-900 dark:border-slate-700 dark:bg-slate-900 dark:text-stone-100"
                />
              </label>
            </div>
            <label className="mb-4 block">
              <span className="mb-1 block text-sm font-medium text-heading">Note (optional)</span>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Walked to the shop with a podcast"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2 text-stone-900 placeholder:text-stone-400 dark:border-slate-700 dark:bg-slate-900 dark:text-stone-100 dark:placeholder:text-stone-500"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={addEntry}
                className="rounded-xl bg-teal-600 px-5 py-2.5 font-medium text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
              >
                Save entry
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl px-5 py-2.5 text-muted hover:bg-white/50 dark:hover:bg-slate-800/80"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {dayEntries.length === 0 ? (
          <p className="text-muted italic">No movement logged for this day. Tap &quot;Log movement&quot; when you&apos;re ready.</p>
        ) : (
          <ul className="space-y-3">
            {dayEntries.map((e) => {
              const meta = KIND_OPTIONS.find((k) => k.id === e.kind)
              return (
                <li
                  key={e.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200/70 bg-white/50 px-4 py-3 dark:border-night-600 dark:bg-night-800/40"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-heading">
                        {meta?.label ?? e.kind} · {e.minutes} min
                      </p>
                      {e.note && <p className="text-sm text-muted">{e.note}</p>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEntry(e.id)}
                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    aria-label="Remove entry"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        </div>
        <div className="glass-effect rounded-2xl p-6 card-hover xl:col-span-5">
          <h3 className="mb-3 text-lg font-semibold text-heading">Movement summary</h3>
          <div className="space-y-3 text-sm text-muted">
            <p>Today: <span className="font-semibold text-heading">{dayTotalMinutes} min</span></p>
            <p>Last 7 days: <span className="font-semibold text-heading">{weekTotal} min</span></p>
            <p>Logs today: <span className="font-semibold text-heading">{dayEntries.length}</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExerciseTracker
