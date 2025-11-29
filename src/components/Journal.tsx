import { useState } from 'react'
import { format } from 'date-fns'
import { BookOpen, Plus, Edit2, Trash2 } from 'lucide-react'
import { JournalEntry, MoodLevel } from '../types'

interface JournalProps {
  journalEntries: JournalEntry[]
  setJournalEntries: (entries: JournalEntry[] | ((prev: JournalEntry[]) => JournalEntry[])) => void
}

const Journal = ({ journalEntries, setJournalEntries }: JournalProps) => {
  const [showModal, setShowModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null)

  const handleOpenModal = (entry?: JournalEntry) => {
    if (entry) {
      setEditingEntry(entry)
      setTitle(entry.title)
      setContent(entry.content)
      setSelectedMood(entry.mood || null)
    } else {
      setEditingEntry(null)
      setTitle('')
      setContent('')
      setSelectedMood(null)
    }
    setShowModal(true)
  }

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return

    const newEntry: JournalEntry = {
      id: editingEntry?.id || crypto.randomUUID(),
      date: editingEntry?.date || format(new Date(), 'yyyy-MM-dd'),
      title: title.trim(),
      content: content.trim(),
      mood: selectedMood || undefined,
    }

    if (editingEntry) {
      setJournalEntries(prev => prev.map(e => e.id === editingEntry.id ? newEntry : e))
    } else {
      setJournalEntries(prev => [...prev, newEntry])
    }

    setShowModal(false)
    setEditingEntry(null)
    setTitle('')
    setContent('')
    setSelectedMood(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setJournalEntries(prev => prev.filter(e => e.id !== id))
    }
  }

  const sortedEntries = [...journalEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const moodColors: Record<MoodLevel, string> = {
    1: 'bg-red-100 text-red-700',
    2: 'bg-orange-100 text-orange-700',
    3: 'bg-yellow-100 text-yellow-700',
    4: 'bg-green-100 text-green-700',
    5: 'bg-emerald-100 text-emerald-700',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <BookOpen className="text-primary-600" size={32} />
            Journal
          </h2>
          <p className="text-gray-600">Write down your thoughts and feelings</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          New Entry
        </button>
      </div>

      {sortedEntries.length === 0 ? (
        <div className="glass-effect rounded-2xl p-12 text-center">
          <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg mb-2">No journal entries yet</p>
          <p className="text-gray-400 text-sm">Start writing to track your thoughts and feelings</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEntries.map((entry) => (
            <div
              key={entry.id}
              className="glass-effect rounded-2xl p-6 card-hover group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {entry.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {format(new Date(entry.date), 'MMM d, yyyy')}
                  </p>
                </div>
                {entry.mood && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ml-2 ${moodColors[entry.mood]}`}>
                    {entry.mood}
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm line-clamp-4 mb-4">
                {entry.content}
              </p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenModal(entry)}
                  className="flex-1 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your entry a title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mood (optional)
                </label>
                <div className="flex gap-2">
                  {([1, 2, 3, 4, 5] as MoodLevel[]).map(mood => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-200 ${
                        selectedMood === mood
                          ? `${moodColors[mood]} scale-110 ring-4 ring-primary-200`
                          : `${moodColors[mood]} opacity-60 hover:opacity-100 hover:scale-105`
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={12}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingEntry(null)
                  setTitle('')
                  setContent('')
                  setSelectedMood(null)
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim() || !content.trim()}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

