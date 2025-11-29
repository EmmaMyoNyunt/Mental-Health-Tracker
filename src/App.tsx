import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import MoodTracker from './components/MoodTracker'
import Journal from './components/Journal'
import Insights from './components/Insights'
import Sidebar from './components/Sidebar'
import { MoodEntry, JournalEntry } from './types'

function App() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMoods = localStorage.getItem('moodEntries')
    const savedJournals = localStorage.getItem('journalEntries')
    
    if (savedMoods) {
      setMoodEntries(JSON.parse(savedMoods))
    }
    if (savedJournals) {
      setJournalEntries(JSON.parse(savedJournals))
    }
  }, [])

  // Save mood entries to localStorage
  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries))
  }, [moodEntries])

  // Save journal entries to localStorage
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries))
  }, [journalEntries])

  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  moodEntries={moodEntries}
                  journalEntries={journalEntries}
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
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

