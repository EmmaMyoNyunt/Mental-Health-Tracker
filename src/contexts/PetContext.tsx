import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { PetType, UserPreferences } from '../types'

interface PetContextType {
  preferences: UserPreferences
  setPetType: (pet: PetType) => void
  setPetName: (name: string) => void
  hasSelectedPet: boolean
}

const PetContext = createContext<PetContextType | undefined>(undefined)

export const PetProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('moodGarden_preferences')
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      petType: null,
      petName: '',
      theme: 'light',
    }
  })

  useEffect(() => {
    localStorage.setItem('moodGarden_preferences', JSON.stringify(preferences))
  }, [preferences])

  const setPetType = (pet: PetType) => {
    setPreferences(prev => ({ ...prev, petType: pet }))
  }

  const setPetName = (name: string) => {
    setPreferences(prev => ({ ...prev, petName: name }))
  }

  // Pet is only considered selected if both type and name are set
  const hasSelectedPet = preferences.petType !== null && preferences.petName !== null && preferences.petName !== undefined && preferences.petName.trim() !== ''

  return (
    <PetContext.Provider value={{ preferences, setPetType, setPetName, hasSelectedPet }}>
      {children}
    </PetContext.Provider>
  )
}

export const usePet = () => {
  const context = useContext(PetContext)
  if (!context) {
    throw new Error('usePet must be used within PetProvider')
  }
  return context
}

