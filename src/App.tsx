import { useState, useEffect, useMemo, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { PetProvider, usePet } from './contexts/PetContext'
import Dashboard from './components/Dashboard'
import MoodTracker from './components/MoodTracker'
import Journal from './components/Journal'
import Insights from './components/Insights'
import StressTracker from './components/StressTracker'
import AppetiteTracker from './components/AppetiteTracker'
import SleepTracker from './components/SleepTracker'
import MindfulTips from './components/MindfulTips'
import Calendar from './components/Calendar'
import TodoList from './components/TodoList'
import Settings from './components/Settings'
import Sidebar from './components/Sidebar'
import PetSelection from './components/PetSelection'
import AIChatbot from './components/AIChatbot'
import { MoodEntry, JournalEntry, StressEntry, AppetiteEntry, SleepEntry, TodoTask } from './types'

const AppContent = () => {
  const { hasSelectedPet, preferences } = usePet()
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [stressEntries, setStressEntries] = useState<StressEntry[]>([])
  const [appetiteEntries, setAppetiteEntries] = useState<AppetiteEntry[]>([])
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])
  const [todos, setTodos] = useState<TodoTask[]>([])

  // Get storage key based on pet type and name (sanitized) - memoized to prevent recreation
  const getStorageKey = useCallback((key: string) => {
    if (!preferences.petType || !preferences.petName) {
      console.warn('Cannot generate storage key: pet preferences not available')
      return null
    }
    // Sanitize pet name for use in localStorage key (remove special chars, spaces become underscores)
    const sanitizedName = preferences.petName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')
    return `moodGarden_${preferences.petType}_${sanitizedName}_${key}`
  }, [preferences.petType, preferences.petName])

  // Load data from localStorage on mount - only run once when pet is selected
  useEffect(() => {
    if (!hasSelectedPet || !preferences.petType || !preferences.petName) return

    const moodKey = getStorageKey('moodEntries')
    const journalKey = getStorageKey('journalEntries')
    const stressKey = getStorageKey('stressEntries')
    const appetiteKey = getStorageKey('appetiteEntries')
    const sleepKey = getStorageKey('sleepEntries')
    const todoKey = getStorageKey('todos')

    if (!moodKey || !journalKey || !stressKey || !appetiteKey || !sleepKey || !todoKey) {
      console.warn('Storage keys not available, skipping data load')
      return
    }

    // Only load if state is empty (prevent overwriting existing state)
    if (moodEntries.length === 0) {
      const savedMoods = localStorage.getItem(moodKey)
      if (savedMoods) {
        try {
          const parsed = JSON.parse(savedMoods)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMoodEntries(parsed)
          }
        } catch (e) {
          console.error('Error parsing mood entries:', e)
        }
      }
    }

    if (journalEntries.length === 0) {
      const savedJournals = localStorage.getItem(journalKey)
      if (savedJournals) {
        try {
          const parsed = JSON.parse(savedJournals)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setJournalEntries(parsed)
          }
        } catch (e) {
          console.error('Error parsing journal entries:', e)
        }
      }
    }

    if (stressEntries.length === 0) {
      const savedStress = localStorage.getItem(stressKey)
      if (savedStress) {
        try {
          const parsed = JSON.parse(savedStress)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStressEntries(parsed)
          }
        } catch (e) {
          console.error('Error parsing stress entries:', e)
        }
      }
    }

    if (appetiteEntries.length === 0) {
      const savedAppetite = localStorage.getItem(appetiteKey)
      if (savedAppetite) {
        try {
          const parsed = JSON.parse(savedAppetite)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAppetiteEntries(parsed)
          }
        } catch (e) {
          console.error('Error parsing appetite entries:', e)
        }
      }
    }

    if (sleepEntries.length === 0) {
      const savedSleep = localStorage.getItem(sleepKey)
      if (savedSleep) {
        try {
          const parsed = JSON.parse(savedSleep)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSleepEntries(parsed)
          }
        } catch (e) {
          console.error('Error parsing sleep entries:', e)
        }
      }
    }

    if (todos.length === 0) {
      const savedTodos = localStorage.getItem(todoKey)
      if (savedTodos) {
        try {
          const parsed = JSON.parse(savedTodos)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTodos(parsed)
          }
        } catch (e) {
          console.error('Error parsing todos:', e)
        }
      }
    }
  }, [hasSelectedPet, preferences.petType, preferences.petName]) // Only depend on these, not getStorageKey

  // Save mood entries to localStorage
  useEffect(() => {
    if (!hasSelectedPet || !preferences.petType || !preferences.petName) return
    const key = getStorageKey('moodEntries')
    if (key) {
      localStorage.setItem(key, JSON.stringify(moodEntries))
    }
  }, [moodEntries, hasSelectedPet, preferences.petType, preferences.petName, getStorageKey])

  // Save journal entries to localStorage
  useEffect(() => {
    if (!hasSelectedPet || !preferences.petType || !preferences.petName) return
    const key = getStorageKey('journalEntries')
    if (key) {
      localStorage.setItem(key, JSON.stringify(journalEntries))
    }
  }, [journalEntries, hasSelectedPet, preferences.petType, preferences.petName, getStorageKey])

  // Save stress entries to localStorage
  useEffect(() => {
    if (!hasSelectedPet || !preferences.petType || !preferences.petName) return
    const key = getStorageKey('stressEntries')
    if (key) {
      localStorage.setItem(key, JSON.stringify(stressEntries))
    }
  }, [stressEntries, hasSelectedPet, preferences.petType, preferences.petName, getStorageKey])

  // Save appetite entries to localStorage
  useEffect(() => {
    if (!hasSelectedPet || !preferences.petType || !preferences.petName) return
    const key = getStorageKey('appetiteEntries')
    if (key) {
      localStorage.setItem(key, JSON.stringify(appetiteEntries))
    }
  }, [appetiteEntries, hasSelectedPet, preferences.petType, preferences.petName, getStorageKey])

  // Save sleep entries to localStorage
  useEffect(() => {
    if (!hasSelectedPet || !preferences.petType || !preferences.petName) return
    const key = getStorageKey('sleepEntries')
    if (key) {
      localStorage.setItem(key, JSON.stringify(sleepEntries))
    }
  }, [sleepEntries, hasSelectedPet, preferences.petType, preferences.petName, getStorageKey])

  // Save todos to localStorage
  useEffect(() => {
    if (!hasSelectedPet || !preferences.petType || !preferences.petName) return
    const key = getStorageKey('todos')
    if (key) {
      localStorage.setItem(key, JSON.stringify(todos))
    }
  }, [todos, hasSelectedPet, preferences.petType, preferences.petName, getStorageKey])

  if (!hasSelectedPet) {
    return <PetSelection />
  }

  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8">
          <AIChatbot />
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  moodEntries={moodEntries}
                  journalEntries={journalEntries}
                  stressEntries={stressEntries}
                  appetiteEntries={appetiteEntries}
                  sleepEntries={sleepEntries}
                />
              } 
            />
            <Route 
              path="/mood" 
              element={
                <MoodTracker 
                  moodEntries={moodEntries}
                  setMoodEntries={setMoodEntries}
                />
              } 
            />
            <Route 
              path="/stress" 
              element={
                <StressTracker 
                  stressEntries={stressEntries}
                  setStressEntries={setStressEntries}
                />
              } 
            />
            <Route 
              path="/appetite" 
              element={
                <AppetiteTracker 
                  appetiteEntries={appetiteEntries}
                  setAppetiteEntries={setAppetiteEntries}
                />
              } 
            />
            <Route 
              path="/sleep" 
              element={
                <SleepTracker 
                  sleepEntries={sleepEntries}
                  setSleepEntries={setSleepEntries}
                />
              } 
            />
            <Route 
              path="/tips" 
              element={
                <MindfulTips 
                  moodEntries={moodEntries}
                  stressEntries={stressEntries}
                  appetiteEntries={appetiteEntries}
                  sleepEntries={sleepEntries}
                  journalEntries={journalEntries}
                />
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <Calendar 
                  moodEntries={moodEntries}
                  stressEntries={stressEntries}
                  sleepEntries={sleepEntries}
                  appetiteEntries={appetiteEntries}
                />
              } 
            />
            <Route 
              path="/todos" 
              element={
                <TodoList 
                  todos={todos}
                  setTodos={setTodos}
                />
              } 
            />
            <Route 
              path="/journal" 
              element={
                <Journal 
                  journalEntries={journalEntries}
                  setJournalEntries={setJournalEntries}
                />
              } 
            />
            <Route 
              path="/insights" 
              element={
                <Insights 
                  moodEntries={moodEntries}
                  journalEntries={journalEntries}
                  stressEntries={stressEntries}
                  appetiteEntries={appetiteEntries}
                  sleepEntries={sleepEntries}
                />
              } 
            />
            <Route 
              path="/settings" 
              element={<Settings />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function App() {
  return (
    <ThemeProvider>
      <PetProvider>
        <AppContent />
      </PetProvider>
    </ThemeProvider>
  )
}

export default App

