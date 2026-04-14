import { useMemo, useState } from 'react'
import { format, parseISO, isValid } from 'date-fns'
import { BookOpen, Plus, Edit2, Trash2, ChevronDown, ChevronUp, Calendar as CalendarIcon } from 'lucide-react'
import { JournalEntry, MoodLevel } from '../types'

interface JournalProps {
  journalEntries: JournalEntry[]
  setJournalEntries: (entries: JournalEntry[] | ((prev: JournalEntry[]) => JournalEntry[])) => void
}

type SortOrder = 'newest' | 'oldest'

const getCreatedTime = (e: JournalEntry) => {
  if (e.createdAt) {
    const t = new Date(e.createdAt).getTime()
    if (!Number.isNaN(t)) return t
  }
  return new Date(`${e.date}T12:00:00`).getTime()
}

const Journal = ({ journalEntries, setJournalEntries }: JournalProps) => {
  const [showModal, setShowModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [entryDate, setEntryDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [filterDate, setFilterDate] = useState<string>('') // '' = all dates
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const handleOpenModal = (entry?: JournalEntry) => {
    if (entry) {
      setEditingEntry(entry)
      setTitle(entry.title)
      setContent(entry.content)
      setEntryDate(entry.date)
      setSelectedMood(entry.mood || null)
    } else {
      setEditingEntry(null)
      setTitle('')
      setContent('')
      setEntryDate(todayStr)
      setSelectedMood(null)
    }
    setShowModal(true)
  }

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return

    const nowIso = new Date().toISOString()
    const newEntry: JournalEntry = {
      id: editingEntry?.id || crypto.randomUUID(),
      date: entryDate,
      title: title.trim(),
      content: content.trim(),
      mood: selectedMood || undefined,
      createdAt: editingEntry?.createdAt ?? nowIso,
    }

    if (editingEntry) {
      setJournalEntries((prev) => prev.map((e) => (e.id === editingEntry.id ? newEntry : e)))
    } else {
      setJournalEntries((prev) => [...prev, newEntry])
    }

    setShowModal(false)
    setEditingEntry(null)
    setTitle('')
    setContent('')
    setEntryDate(todayStr)
    setSelectedMood(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setJournalEntries((prev) => prev.filter((e) => e.id !== id))
      setExpandedIds((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }
  }

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredAndSorted = useMemo(() => {
    let list = filterDate ? journalEntries.filter((e) => e.date === filterDate) : [...journalEntries]

    list.sort((a, b) => {
      if (a.date !== b.date) {
        const cmp = a.date.localeCompare(b.date)
        return sortOrder === 'newest' ? -cmp : cmp
      }
      const at = getCreatedTime(a)
      const bt = getCreatedTime(b)
      return sortOrder === 'newest' ? bt - at : at - bt
    })

    return list
  }, [journalEntries, filterDate, sortOrder])

  const sections = useMemo(() => {
    const out: { dayKey: string; entries: JournalEntry[] }[] = []
    for (const e of filteredAndSorted) {
      const last = out[out.length - 1]
      if (last && last.dayKey === e.date) {
        last.entries.push(e)
      } else {
        out.push({ dayKey: e.date, entries: [e] })
      }
    }
    return out
  }, [filteredAndSorted])

  const moodColors: Record<MoodLevel, string> = {
    1: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    2: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    3: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    4: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    5: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  }

  const formatDayHeading = (dayKey: string) => {
    const d = parseISO(dayKey + 'T12:00:00')
    if (!isValid(d)) return dayKey
    if (dayKey === todayStr) return `Today · ${format(d, 'EEEE, MMM d, yyyy')}`
    return format(d, 'EEEE, MMM d, yyyy')
  }

  return (
    <div className="page-shell animate-fade-in">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="mb-2 flex items-center gap-3 text-3xl font-bold text-heading">
            <BookOpen className="text-primary-600 dark:text-primary-400" size={32} />
            Journal
          </h2>
          <p className="text-muted">Write down your thoughts and feelings. Entries stay saved on this device until you delete them.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-white shadow-lg transition-all duration-200 hover:bg-primary-700 hover:shadow-xl dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          <Plus size={20} />
          New Entry
        </button>
      </div>

      {journalEntries.length > 0 && (
        <div className="glass-effect mb-6 flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted">Sort by</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-heading dark:border-slate-600 dark:bg-slate-800"
            >
              <option value="newest">Newest first (today near the top)</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1 text-xs font-medium text-muted">
              <CalendarIcon size={14} />
              Find by date
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-slate-600 dark:bg-slate-800 dark:text-stone-100"
              />
              <button
                type="button"
                onClick={() => setFilterDate(todayStr)}
                className="rounded-lg border border-amber-200/80 bg-white px-3 py-2 text-xs font-medium text-primary-700 hover:bg-amber-50 dark:border-slate-600 dark:bg-slate-800 dark:text-primary-300 dark:hover:bg-slate-700"
              >
                Today
              </button>
              {filterDate ? (
                <button
                  type="button"
                  onClick={() => setFilterDate('')}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-muted hover:text-heading"
                >
                  Clear filter
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {journalEntries.length === 0 ? (
        <div className="glass-effect rounded-2xl p-12 text-center">
          <BookOpen className="mx-auto mb-4 text-stone-300 dark:text-slate-600" size={48} />
          <p className="mb-2 text-lg text-muted">No journal entries yet</p>
          <p className="text-sm text-faint">Start writing to track your thoughts and feelings</p>
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="glass-effect rounded-2xl p-8 text-center">
          <p className="text-muted">No entries for {filterDate ? format(parseISO(filterDate + 'T12:00:00'), 'MMM d, yyyy') : 'this filter'}.</p>
          <button type="button" onClick={() => setFilterDate('')} className="mt-3 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400">
            Show all dates
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.dayKey}>
              <h3 className="mb-4 border-b border-amber-200/60 pb-2 text-lg font-semibold text-heading dark:border-slate-700">
                {formatDayHeading(section.dayKey)}
                <span className="ml-2 text-sm font-normal text-muted">
                  ({section.entries.length} {section.entries.length === 1 ? 'entry' : 'entries'})
                </span>
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {section.entries.map((entry) => {
                  const expanded = !!expandedIds[entry.id]
                  const longContent = entry.content.length > 220 || entry.content.split('\n').length > 5
                  return (
                    <div key={entry.id} className="glass-effect card-hover group flex flex-col rounded-2xl p-6">
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="mb-1 line-clamp-2 text-lg font-semibold text-heading">{entry.title}</h4>
                          <p className="text-xs text-muted">
                            {format(parseISO(entry.date + 'T12:00:00'), 'MMM d, yyyy')}
                          </p>
                        </div>
                        {entry.mood ? (
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${moodColors[entry.mood]}`}
                          >
                            {entry.mood}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm text-body ${expanded ? '' : 'line-clamp-4'} whitespace-pre-wrap`}
                        >
                          {entry.content}
                        </p>
                        {longContent ? (
                          <button
                            type="button"
                            onClick={() => toggleExpanded(entry.id)}
                            className="mt-3 flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
                          >
                            {expanded ? (
                              <>
                                <ChevronUp size={16} />
                                Show less
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} />
                                Read full entry
                              </>
                            )}
                          </button>
                        ) : null}
                      </div>
                      <div className="mt-4 flex gap-2 border-t border-stone-200/60 pt-4 opacity-100 transition-opacity dark:border-slate-700/80 sm:opacity-0 sm:group-hover:opacity-100">
                        <button
                          onClick={() => handleOpenModal(entry)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary-200/80 bg-primary-100 px-3 py-2 text-sm font-medium text-primary-900 transition-colors hover:bg-primary-200 dark:border-slate-500/70 dark:bg-slate-700 dark:text-stone-100 dark:hover:border-slate-400 dark:hover:bg-slate-600 dark:hover:text-white"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="rounded-lg border border-red-200/80 bg-red-100 px-3 py-2 text-red-800 transition-colors hover:bg-red-200 dark:border-red-800/60 dark:bg-red-950/50 dark:text-red-200 dark:hover:border-red-700 dark:hover:bg-red-900/45 dark:hover:text-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl animate-scale-in dark:bg-slate-900">
            <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-stone-100">
              {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-stone-300">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your entry a title..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-stone-300">Entry date</label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-stone-100"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-stone-400">You can add more than one entry per day.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-stone-300">Mood (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {([1, 2, 3, 4, 5] as MoodLevel[]).map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
                      className={`flex h-12 w-12 items-center justify-center rounded-full font-bold transition-all duration-200 ${
                        selectedMood === mood
                          ? `${moodColors[mood]} scale-110 ring-4 ring-primary-200 dark:ring-primary-800`
                          : `${moodColors[mood]} opacity-60 hover:scale-105 hover:opacity-100`
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-stone-300">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts here..."
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-stone-100"
                  rows={12}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingEntry(null)
                  setTitle('')
                  setContent('')
                  setEntryDate(todayStr)
                  setSelectedMood(null)
                }}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-600 dark:text-stone-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim() || !content.trim()}
                className="flex-1 rounded-xl bg-primary-600 px-4 py-3 text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                {editingEntry ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Journal
