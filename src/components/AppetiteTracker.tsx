import { useState } from 'react'
import { format } from 'date-fns'
import { UtensilsCrossed, Plus, Droplet, Trash2, Edit2 } from 'lucide-react'
import { AppetiteEntry, MealEntry } from '../types'

interface AppetiteTrackerProps {
  appetiteEntries: AppetiteEntry[]
  setAppetiteEntries: (entries: AppetiteEntry[] | ((prev: AppetiteEntry[]) => AppetiteEntry[])) => void
}

const AppetiteTracker = ({ appetiteEntries, setAppetiteEntries }: AppetiteTrackerProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [waterIntake, setWaterIntake] = useState(0)
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [notes, setNotes] = useState('')

  const today = new Date()
  const dateStr = format(selectedDate, 'yyyy-MM-dd')
  const todayEntry = appetiteEntries.find(e => e.date === dateStr)

  const handleOpenModal = () => {
    if (todayEntry) {
      setWaterIntake(todayEntry.waterIntake)
      setMeals(todayEntry.meals || [])
      setNotes(todayEntry.notes || '')
    } else {
      setWaterIntake(0)
      setMeals([])
      setNotes('')
    }
    setShowModal(true)
  }

  const handleSave = () => {
    const existingIndex = appetiteEntries.findIndex(e => e.date === dateStr)

    const newEntry: AppetiteEntry = {
      id: existingIndex >= 0 ? appetiteEntries[existingIndex].id : crypto.randomUUID(),
      date: dateStr,
      waterIntake,
      meals,
      notes: notes.trim() || undefined,
    }

    if (existingIndex >= 0) {
      setAppetiteEntries(prev => prev.map((e, i) => i === existingIndex ? newEntry : e))
    } else {
      setAppetiteEntries(prev => [...prev, newEntry])
    }

    setShowModal(false)
  }

  const addMeal = () => {
    const newMeal: MealEntry = {
      id: crypto.randomUUID(),
      time: format(new Date(), 'HH:mm'),
      type: 'snack',
      description: '',
    }
    setMeals([...meals, newMeal])
  }

  const updateMeal = (id: string, updates: Partial<MealEntry>) => {
    setMeals(meals.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const removeMeal = (id: string) => {
    setMeals(meals.filter(m => m.id !== id))
  }

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { value: 'lunch', label: 'Lunch', emoji: '🌞' },
    { value: 'dinner', label: 'Dinner', emoji: '🌙' },
    { value: 'snack', label: 'Snack', emoji: '🍎' },
  ] as const

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-3">
            <span className="text-4xl">🍽️</span>
            <UtensilsCrossed className="text-primary-600 dark:text-primary-400" size={32} />
            Appetite Tracker
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Track your water intake and meals</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Log Entry
        </button>
      </div>

      {/* Date Selector */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-soft-lavender/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedDate(today)}
              className="px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-soft-lavender/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {todayEntry ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 p-4 bg-soft-sky/50 dark:bg-blue-900/20 rounded-xl flex-1">
                <Droplet className="text-blue-600 dark:text-blue-400" size={24} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Water Intake</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {todayEntry.waterIntake} {todayEntry.waterIntake === 1 ? 'glass' : 'glasses'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleOpenModal}
                className="p-3 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl ml-2"
                title="Edit entry"
              >
                <Edit2 size={20} />
              </button>
            </div>

            {todayEntry.meals && todayEntry.meals.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Meals</h4>
                <div className="space-y-2">
                  {todayEntry.meals.map(meal => {
                    const mealType = mealTypes.find(m => m.value === meal.type)
                    return (
                      <div key={meal.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <span className="text-2xl">{mealType?.emoji}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-gray-200">{meal.description}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{meal.time} • {mealType?.label}</p>
                        </div>
                        {meal.rating && (
                          <div className="text-yellow-500">
                            {'⭐'.repeat(meal.rating)}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {todayEntry.notes && (
              <div className="p-4 bg-soft-cream/50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">{todayEntry.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
            No entry for this date. Click "Log Entry" to add one!
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>

            <div className="space-y-6">
              {/* Water Intake */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Droplet className="text-blue-600 dark:text-blue-400" size={20} />
                  Water Intake (glasses)
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))}
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="text-3xl font-bold text-gray-800 dark:text-gray-200 w-16 text-center">
                    {waterIntake}
                  </span>
                  <button
                    onClick={() => setWaterIntake(waterIntake + 1)}
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Meals */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meals
                  </label>
                  <button
                    onClick={addMeal}
                    className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm"
                  >
                    + Add Meal
                  </button>
                </div>
                <div className="space-y-3">
                  {meals.map(meal => {
                    const mealType = mealTypes.find(m => m.value === meal.type)
                    return (
                      <div key={meal.id} className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl">
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-2xl">{mealType?.emoji}</span>
                          <div className="flex-1 space-y-2">
                            <select
                              value={meal.type}
                              onChange={(e) => updateMeal(meal.id, { type: e.target.value as any })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            >
                              {mealTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={meal.description}
                              onChange={(e) => updateMeal(meal.id, { description: e.target.value })}
                              placeholder="What did you eat?"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={meal.time}
                                onChange={(e) => updateMeal(meal.id, { time: e.target.value })}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                              />
                              <select
                                value={meal.rating || ''}
                                onChange={(e) => updateMeal(meal.id, { rating: e.target.value ? parseInt(e.target.value) as any : undefined })}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                              >
                                <option value="">No rating</option>
                                {[1, 2, 3, 4, 5].map(r => (
                                  <option key={r} value={r}>{r} ⭐</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <button
                            onClick={() => removeMeal(meal.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes about your appetite..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
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

export default AppetiteTracker

