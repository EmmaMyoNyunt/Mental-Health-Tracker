export type MoodLevel = 1 | 2 | 3 | 4 | 5

export interface MoodEntry {
  id: string
  date: string
  mood: MoodLevel
  notes?: string
  tags?: string[]
}

export interface JournalEntry {
  id: string
  date: string
  title: string
  content: string
  mood?: MoodLevel
  tags?: string[]
}

export interface MoodStats {
  average: number
  trend: 'up' | 'down' | 'stable'
  totalEntries: number
}

