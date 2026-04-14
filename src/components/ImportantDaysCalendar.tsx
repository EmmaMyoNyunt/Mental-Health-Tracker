import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths } from 'date-fns'
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react'
import { ImportantDayEntry } from '../types'

interface ImportantDaysCalendarProps {
  importantDays: ImportantDayEntry[]
  setImportantDays: Dispatch<SetStateAction<ImportantDayEntry[]>>
}

const sortEntriesForDay = (a: ImportantDayEntry, b: ImportantDayEntry) => {
  if (!a.time && !b.time) return a.title.localeCompare(b.title)
  if (!a.time && b.time) return -1
  if (a.time && !b.time) return 1
  return (a.time || '').localeCompare(b.time || '')
}

const ImportantDaysCalendar = ({ importantDays, setImportantDays }: ImportantDaysCalendarProps) => {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formTime, setFormTime] = useState('')
  const [formDescription, setFormDescription] = useState('')

  const today = new Date()
  const monthStart = startOfMonth(viewMonth)
  const monthEnd = endOfMonth(viewMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const firstDow = monthStart.getDay()
  const paddingBefore = Array.from({ length: firstDow === 0 ? 6 : firstDow - 1 }, () => null as null)

  const byDate = useMemo(() => {
    const map = new Map<string, ImportantDayEntry[]>()
    for (const e of importantDays) {
      const list = map.get(e.date) ?? []
      list.push(e)
      map.set(e.date, list)
    }
    for (const [, list] of map) {
      list.sort(sortEntriesForDay)
    }
    return map
  }, [importantDays])

  const upcomingSorted = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    return [...importantDays]
      .filter((e) => e.date >= todayStr)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date)
        return sortEntriesForDay(a, b)
      })
      .slice(0, 12)
  }, [importantDays])

  const openNewForDate = (d: Date) => {
    setEditingId(null)
    setFormTitle('')
    setFormDate(format(d, 'yyyy-MM-dd'))
    setFormTime('')
    setFormDescription('')
    setModalOpen(true)
  }

  const openEdit = (entry: ImportantDayEntry) => {
    setEditingId(entry.id)
    setFormTitle(entry.title)
    setFormDate(entry.date)
    setFormTime(entry.time || '')
    setFormDescription(entry.description || '')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
  }

  const handleSave = () => {
    const title = formTitle.trim()
    if (!title || !formDate) return
    if (editingId) {
      setImportantDays((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? {
                ...e,
                title,
                date: formDate,
                time: formTime.trim() || undefined,
                description: formDescription.trim() || undefined,
              }
            : e
        )
      )
    } else {
      const entry: ImportantDayEntry = {
        id: crypto.randomUUID(),
        title,
        date: formDate,
        time: formTime.trim() || undefined,
        description: formDescription.trim() || undefined,
      }
      setImportantDays((prev) => [...prev, entry])
    }
    closeModal()
  }

  const handleDelete = (id: string) => {
    setImportantDays((prev) => prev.filter((e) => e.id !== id))
    if (editingId === id) closeModal()
  }

  const selectedStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null
  const selectedEntries = selectedStr ? byDate.get(selectedStr) ?? [] : []

  return (
    <div className="page-shell animate-fade-in">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="mb-1 flex items-center gap-2 text-2xl font-bold text-heading">
            <CalendarDays className="text-primary-600 dark:text-primary-400" size={26} />
            Key dates
          </h2>
          <p className="text-muted max-w-xl text-sm">
            Log birthdays, holidays, exams, and anything else you want to remember. This calendar is separate from your
            wellness tracker calendar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openNewForDate(selectedDate ?? today)}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          <Plus size={18} />
          Add date
        </button>
      </div>

      <div className="panel-grid gap-4 xl:grid-cols-12">
        <div className="glass-effect card-hover rounded-2xl p-4 sm:p-6 xl:col-span-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-heading">{format(viewMonth, 'MMMM yyyy')}</h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMonth((m) => addMonths(m, -1))}
                className="rounded-lg p-2 text-muted hover:bg-white/70 dark:hover:bg-slate-800/80"
                aria-label="Previous month"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => setViewMonth(startOfMonth(today))}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-100/80 dark:text-primary-300 dark:hover:bg-primary-950/40"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setViewMonth((m) => addMonths(m, 1))}
                className="rounded-lg p-2 text-muted hover:bg-white/70 dark:hover:bg-slate-800/80"
                aria-label="Next month"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-muted">
                {d}
              </div>
            ))}
            {paddingBefore.map((_, idx) => (
              <div key={`pad-${idx}`} />
            ))}
            {monthDays.map((day) => {
              const key = format(day, 'yyyy-MM-dd')
              const dayEntries = byDate.get(key) ?? []
              const isToday = isSameDay(day, today)
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedDate(day)
                  }}
                  className={`relative flex min-h-[72px] flex-col rounded-xl border-2 p-1.5 text-left transition sm:min-h-[88px] sm:p-2 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50/90 ring-1 ring-primary-400/50 dark:bg-primary-950/40'
                      : 'border-transparent bg-white/60 hover:border-amber-200/80 dark:bg-slate-800/50 dark:hover:border-slate-600'
                  } ${isToday ? 'ring-2 ring-primary-400/70 dark:ring-primary-500/50' : ''}`}
                >
                  <span
                    className={`text-sm font-medium ${isToday ? 'font-bold text-primary-700 dark:text-primary-300' : 'text-heading'}`}
                  >
                    {format(day, 'd')}
                  </span>
                  {dayEntries.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-0.5 pt-1">
                      {dayEntries.slice(0, 3).map((e) => (
                        <span
                          key={e.id}
                          className="block max-w-full truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight sm:text-xs bg-amber-100/90 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
                          title={e.title}
                        >
                          {e.title}
                        </span>
                      ))}
                      {dayEntries.length > 3 && (
                        <span className="text-[10px] text-muted sm:text-xs">+{dayEntries.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-4 xl:col-span-5">
          <div className="glass-effect card-hover rounded-2xl p-5">
            <h3 className="mb-3 text-lg font-semibold text-heading">
              {selectedStr ? format(selectedDate!, 'EEEE, MMM d') : 'Pick a day'}
            </h3>
            {selectedStr ? (
              <>
                {selectedEntries.length === 0 ? (
                  <p className="text-muted mb-4 text-sm">No key dates on this day yet.</p>
                ) : (
                  <ul className="mb-4 space-y-3">
                    {selectedEntries.map((e) => (
                      <li
                        key={e.id}
                        className="surface-chip flex flex-col gap-2 rounded-xl p-3 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-heading">{e.title}</p>
                          {e.time ? (
                            <p className="text-xs text-primary-700 dark:text-primary-300">{e.time}</p>
                          ) : null}
                          {e.description ? (
                            <p className="mt-1 text-sm text-muted">{e.description}</p>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(e)}
                            className="rounded-lg p-2 text-primary-600 hover:bg-primary-100/80 dark:text-primary-400 dark:hover:bg-primary-950/50"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(e.id)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={() => selectedDate && openNewForDate(selectedDate)}
                  className="w-full rounded-xl border border-dashed border-amber-300/80 py-2.5 text-sm font-medium text-primary-700 transition hover:bg-amber-50/80 dark:border-slate-600 dark:text-primary-300 dark:hover:bg-slate-800/80"
                >
                  + Add on this day
                </button>
              </>
            ) : (
              <p className="text-muted text-sm">
                Click a day in the calendar to see or add entries. You can also use &quot;Add date&quot; above.
              </p>
            )}
          </div>

          <div className="glass-effect card-hover rounded-2xl p-5">
            <h3 className="mb-3 text-lg font-semibold text-heading">Upcoming</h3>
            {upcomingSorted.length === 0 ? (
              <p className="text-muted text-sm">
                No upcoming key dates. Pick a day on the calendar and use &quot;+ Add on this day&quot; to pin exams, deadlines, or events you care about.
              </p>
            ) : (
              <ul className="space-y-2">
                {upcomingSorted.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMonth(startOfMonth(new Date(e.date + 'T12:00:00')))
                        setSelectedDate(new Date(e.date + 'T12:00:00'))
                      }}
                      className="surface-chip flex w-full items-start justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/90 dark:hover:bg-slate-800/90"
                    >
                      <span className="min-w-0 truncate font-medium text-heading">{e.title}</span>
                      <span className="shrink-0 text-xs text-muted">
                        {format(new Date(e.date + 'T12:00:00'), 'MMM d')}
                        {e.time ? ` · ${e.time}` : ''}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div
            className="glass-effect max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl p-6 shadow-2xl"
            role="dialog"
            aria-labelledby="key-date-modal-title"
          >
            <h3 id="key-date-modal-title" className="mb-4 text-xl font-bold text-heading">
              {editingId ? 'Edit key date' : 'New key date'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted">Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(ev) => setFormTitle(ev.target.value)}
                  placeholder="e.g. Birthday, Easter, Final exam"
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-heading dark:border-slate-600 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted">Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(ev) => setFormDate(ev.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-heading dark:border-slate-600 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted">Time (optional)</label>
                <input
                  type="time"
                  value={formTime}
                  onChange={(ev) => setFormTime(ev.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-heading dark:border-slate-600 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted">Description (optional)</label>
                <textarea
                  value={formDescription}
                  onChange={(ev) => setFormDescription(ev.target.value)}
                  rows={3}
                  placeholder="Extra notes…"
                  className="w-full resize-none rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-heading dark:border-slate-600 dark:bg-slate-800"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {editingId ? (
                <button
                  type="button"
                  onClick={() => handleDelete(editingId)}
                  className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  Delete
                </button>
              ) : null}
              <button
                type="button"
                onClick={closeModal}
                className="ml-auto rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-muted hover:bg-stone-50 dark:border-slate-600 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!formTitle.trim() || !formDate}
                className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
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

export default ImportantDaysCalendar
