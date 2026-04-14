import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { usePet } from '../contexts/PetContext'
import { PetType } from '../types'

const PET_OPTIONS: { id: Exclude<PetType, null>; emoji: string; label: string; subtitle: string }[] = [
  { id: 'cat', emoji: '🐱', label: 'Cat', subtitle: 'Calm and curious companion' },
  { id: 'dog', emoji: '🐶', label: 'Dog', subtitle: 'Energetic and loyal friend' },
  { id: 'rabbit', emoji: '🐰', label: 'Rabbit', subtitle: 'Gentle and thoughtful' },
  { id: 'horse', emoji: '🐴', label: 'Horse', subtitle: 'Steady and grounded' },
  { id: 'bird', emoji: '🐦', label: 'Bird', subtitle: 'Light and expressive' },
  { id: 'panda', emoji: '🐼', label: 'Panda', subtitle: 'Soft and peaceful' },
  { id: 'penguin', emoji: '🐧', label: 'Penguin', subtitle: 'Resilient and social' },
  { id: 'fox', emoji: '🦊', label: 'Fox', subtitle: 'Bright and adaptable' },
  { id: 'turtle', emoji: '🐢', label: 'Turtle', subtitle: 'Slow, steady progress' },
]

const PET_EMOJI: Record<Exclude<PetType, null>, string> = Object.fromEntries(
  PET_OPTIONS.map((p) => [p.id, p.emoji])
) as Record<Exclude<PetType, null>, string>

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
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="glass-effect w-full max-w-2xl animate-scale-in rounded-3xl p-8 shadow-2xl md:p-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🌱</span>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
              MoodGarden
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg mt-2">
            Welcome! Choose a companion to help you tend to your mental health garden
          </p>
        </div>

        {!showNameInput ? (
          <div className="space-y-6">
            <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
              Choose a companion to help you track your mental health. Your data will be saved anonymously using your pet&apos;s name.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {PET_OPTIONS.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => handlePetSelect(pet.id)}
                  className={`rounded-2xl border-4 p-6 transition-all duration-300 hover:scale-[1.02] ${
                    selectedPet === pet.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 bg-white hover:border-primary-300 dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className="mb-3 text-5xl">{pet.emoji}</div>
                  <h3 className="mb-1 text-xl font-bold text-gray-800 dark:text-gray-200">{pet.label}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{pet.subtitle}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {selectedPet ? PET_EMOJI[selectedPet] : '🌱'}
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
