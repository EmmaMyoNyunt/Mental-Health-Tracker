import { useState } from 'react'
import { Settings as SettingsIcon, Moon, Sun, User, RotateCcw } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { usePet } from '../contexts/PetContext'
import { PetType } from '../types'
import PrivacyStrip from './PrivacyStrip'

const Settings = () => {
  const { theme, toggleTheme } = useTheme()
  const { preferences, setPetType, setPetName } = usePet()
  const [petNameInput, setPetNameInput] = useState(preferences.petName || '')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('moodGarden_openai_key') || '')

  const handlePetChange = (pet: PetType) => {
    if (confirm('Changing your pet will reset all your data and require you to name your new pet. Are you sure?')) {
      // Clear all localStorage data for this pet
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('moodGarden_') && !key.includes('preferences') && !key.includes('theme')) {
          localStorage.removeItem(key)
        }
      })
      // Reset pet preferences
      setPetType(pet)
      setPetName('')
      setPetNameInput('')
      // Reload to show pet selection screen
      window.location.reload()
    }
  }

  const handleNameSave = () => {
    if (petNameInput.trim()) {
      setPetName(petNameInput.trim())
      alert('Pet name saved! 🌱')
    }
  }

  const handleResetData = () => {
    if (showResetConfirm) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('moodGarden_') && !key.includes('preferences') && !key.includes('theme')) {
          localStorage.removeItem(key)
        }
      })
      alert('All data has been reset.')
      window.location.reload()
    } else {
      setShowResetConfirm(true)
    }
  }

  return (
    <div className="page-shell max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h2 className="mb-2 flex items-center gap-3 text-3xl font-bold text-stone-900 dark:text-stone-50">
          <SettingsIcon className="text-primary-600 dark:text-primary-400" size={32} />
          Settings
        </h2>
        <p className="text-stone-600 dark:text-stone-300">Manage your MoodGarden preferences</p>
      </div>

      <div className="mb-6">
        <PrivacyStrip variant="card" />
      </div>

      {/* Theme Settings */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-semibold text-stone-900 dark:text-stone-50">
              {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
              Appearance
            </h3>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
              Switch between light and dark mode
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-slate-700 text-stone-100 hover:bg-slate-600'
                : 'bg-amber-100 text-amber-950 hover:bg-amber-200/90'
            }`}
          >
            {theme === 'dark' ? (
              <>
                <Moon size={20} />
                Dark Mode
              </>
            ) : (
              <>
                <Sun size={20} />
                Light Mode
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pet Settings */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-stone-900 dark:text-stone-50">
          <User size={24} />
          Your Companion
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-200">
              Pet Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={petNameInput}
                onChange={(e) => setPetNameInput(e.target.value)}
                placeholder="Enter your pet's name"
                className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-stone-100 dark:placeholder:text-stone-500"
                maxLength={20}
              />
              <button
                onClick={handleNameSave}
                className="px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-stone-700 dark:text-stone-200">
              Change Pet (this will reset all data)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handlePetChange('cat')}
                className={`rounded-xl border-4 p-6 transition-all duration-300 ${
                  preferences.petType === 'cat'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-stone-200 bg-white hover:border-primary-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-primary-500/60'
                }`}
              >
                <div className="mb-2 text-5xl">🐱</div>
                <p className="font-semibold text-stone-900 dark:text-stone-50">Cat</p>
              </button>

              <button
                onClick={() => handlePetChange('dog')}
                className={`rounded-xl border-4 p-6 transition-all duration-300 ${
                  preferences.petType === 'dog'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-stone-200 bg-white hover:border-primary-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-primary-500/60'
                }`}
              >
                <div className="mb-2 text-5xl">🐶</div>
                <p className="font-semibold text-stone-900 dark:text-stone-50">Dog</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-stone-900 dark:text-stone-50">
          <RotateCcw size={24} />
          Data Management
        </h3>
        <p className="mb-4 text-sm text-stone-600 dark:text-stone-300">
          Reset all your tracking data. This action cannot be undone.
        </p>
        {showResetConfirm ? (
          <div className="space-y-3">
            <p className="text-red-600 dark:text-red-400 font-medium">
              Are you sure you want to reset all data?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResetData}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Yes, Reset All Data
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="rounded-xl border border-stone-300 px-6 py-3 text-stone-800 transition-colors hover:bg-stone-50 dark:border-slate-600 dark:text-stone-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleResetData}
            className="px-6 py-3 bg-red-600 dark:bg-red-500 text-white rounded-xl hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
          >
            Reset All Data
          </button>
        )}
      </div>

      {/* AI Chatbot Settings */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-stone-900 dark:text-stone-50">
          AI Chatbot Settings
        </h3>
        <p className="mb-4 text-sm text-stone-600 dark:text-stone-300">
          Optionally add your OpenAI API key for enhanced AI responses. Without a key, the chatbot will use basic rule-based responses.
        </p>
        <div className="space-y-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-200">
              OpenAI API Key (optional)
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  const value = e.target.value
                  setApiKey(value)
                  if (value.trim()) {
                    localStorage.setItem('moodGarden_openai_key', value.trim())
                  } else {
                    localStorage.removeItem('moodGarden_openai_key')
                  }
                }}
                placeholder="sk-..."
                className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-stone-100 dark:placeholder:text-stone-500"
              />
              <button
                onClick={() => {
                  setApiKey('')
                  localStorage.removeItem('moodGarden_openai_key')
                }}
                className="rounded-xl border border-stone-300 px-4 py-3 text-stone-800 transition-colors hover:bg-stone-50 dark:border-slate-600 dark:text-stone-200 dark:hover:bg-slate-800"
              >
                Clear
              </button>
            </div>
            <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
              Your API key is stored locally and never shared. Get one at{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                OpenAI
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h3 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-50">
          About MoodGarden
        </h3>
        <p className="mb-2 text-stone-600 dark:text-stone-300">
          MoodGarden is your personal mental health tracking companion. Tend to your garden by tracking your mood, stress, appetite, and journaling your thoughts.
        </p>
        <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
          All your data is stored locally in your browser and remains completely private.
        </p>
      </div>
    </div>
  )
}

export default Settings

