import { useState } from 'react'
import { Heart, Sparkles } from 'lucide-react'
import { usePet } from '../contexts/PetContext'
import { PetType } from '../types'

const PetSelection = () => {
  const { setPetType, setPetName, preferences } = usePet()
  // If pet type is selected but name is missing, show name input
  const [selectedPet, setSelectedPet] = useState<PetType>(preferences.petType)
  const [petName, setPetNameInput] = useState(preferences.petName || '')
  const [showNameInput, setShowNameInput] = useState(preferences.petType !== null && (!preferences.petName || preferences.petName.trim() === ''))

  const handlePetSelect = (pet: PetType) => {
    setSelectedPet(pet)
    setShowNameInput(true)
    // Clear name input when selecting a new pet
    setPetNameInput('')
  }

  const handleContinue = () => {
    if (selectedPet && petName.trim()) {
      setPetType(selectedPet)
      setPetName(petName.trim())
      // The app will automatically show the main interface once both are set
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-cream via-white to-soft-lavender dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="glass-effect dark:bg-gray-800/80 rounded-3xl p-8 md:p-12 max-w-2xl w-full animate-scale-in shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🌱</span>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
              MoodGarden
            </h1>
            <span className="text-5xl">🌸</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg mt-2">
            Welcome! Choose a companion to help you tend to your mental health garden
          </p>
        </div>

        {!showNameInput ? (
          <div className="space-y-6">
            <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
              Choose a companion to help you track your mental health. Your data will be saved anonymously using your pet's name.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => handlePetSelect('cat')}
                className={`p-8 rounded-2xl border-4 transition-all duration-300 hover:scale-105 ${
                  selectedPet === 'cat'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300'
                }`}
              >
                <div className="text-6xl mb-4">🐱</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Cat</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Calm and curious companion
                </p>
              </button>

              <button
                onClick={() => handlePetSelect('dog')}
                className={`p-8 rounded-2xl border-4 transition-all duration-300 hover:scale-105 ${
                  selectedPet === 'dog'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300'
                }`}
              >
                <div className="text-6xl mb-4">🐶</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Dog</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Energetic and loyal friend
                </p>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {selectedPet === 'cat' ? '🐱' : '🐶'}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                What would you like to name your {selectedPet}?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                This name will be used to save your data anonymously. Choose something unique!
              </p>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetNameInput(e.target.value)}
                placeholder="Enter a name (e.g., Fluffy, Max, Luna...)"
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                autoFocus
                maxLength={20}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && petName.trim()) {
                    handleContinue()
                  }
                }}
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowNameInput(false)
                  setPetNameInput('')
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                disabled={!petName.trim()}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles size={20} />
                Start Growing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PetSelection

