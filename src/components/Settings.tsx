import { useState } from 'react'
import { Settings as SettingsIcon, Moon, Sun, User, RotateCcw } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { usePet } from '../contexts/PetContext'
import { PetType } from '../types'

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
      alert('All data has been reset! 🌸')
      window.location.reload()
    } else {
      setShowResetConfirm(true)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-3">
          <span className="text-4xl">⚙️</span>
          <SettingsIcon className="text-primary-600 dark:text-primary-400" size={32} />
          Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your MoodGarden preferences</p>
      </div>

      {/* Theme Settings */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
              Appearance
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Switch between light and dark mode
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
              theme === 'dark'
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
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
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <User size={24} />
          Your Companion
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pet Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={petNameInput}
                onChange={(e) => setPetNameInput(e.target.value)}
                placeholder="Enter your pet's name"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Change Pet (this will reset all data)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handlePetChange('cat')}
                className={`p-6 rounded-xl border-4 transition-all duration-300 ${
                  preferences.petType === 'cat'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300'
                }`}
              >
                <div className="text-5xl mb-2">🐱</div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">Cat</p>
              </button>

              <button
                onClick={() => handlePetChange('dog')}
                className={`p-6 rounded-xl border-4 transition-all duration-300 ${
                  preferences.petType === 'dog'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300'
                }`}
              >
                <div className="text-5xl mb-2">🐶</div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">Dog</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <RotateCcw size={24} />
          Data Management
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
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
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <span>🤖</span>
          AI Chatbot Settings
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Optionally add your OpenAI API key for enhanced AI responses. Without a key, the chatbot will use basic rule-based responses.
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
              <button
                onClick={() => {
                  setApiKey('')
                  localStorage.removeItem('moodGarden_openai_key')
                }}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
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
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          About MoodGarden 🌱
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          MoodGarden is your personal mental health tracking companion. Tend to your garden by tracking your mood, stress, appetite, and journaling your thoughts.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          All your data is stored locally in your browser and remains completely private.
        </p>
      </div>
    </div>
  )
}

export default Settings

