export type MoodLevel = 1 | 2 | 3 | 4 | 5 // Keep for backward compatibility
export type StressLevel = 1 | 2 | 3 | 4 | 5
export type PetType =
  | 'cat'
  | 'dog'
  | 'rabbit'
  | 'horse'
  | 'bird'
  | 'panda'
  | 'penguin'
  | 'fox'
  | 'turtle'
  | null
export type Theme = 'light' | 'dark'

// Arousal-Valence Model
export type Valence = -2 | -1 | 0 | 1 | 2 // Negative to Positive
export type Arousal = 1 | 2 | 3 | 4 | 5 // Low to High

export interface Emotion {
  valence: Valence
  arousal: Arousal
  label: string
  emoji: string
  color?: 'yellow' | 'red' | 'green' | 'blue' | 'gray'
}

export interface MoodEntry {
  id: string
  date: string
  mood?: MoodLevel // Legacy support
  valence?: Valence
  arousal?: Arousal
  emotion?: Emotion // Primary emotion (for backward compatibility)
  emotionId?: string // Primary emotion identifier (for backward compatibility)
  emotions?: Emotion[] // Up to 2 emotions
  emotionIds?: string[] // Up to 2 emotion identifiers
  notes?: string
  tags?: string[]
}

export interface StressEntry {
  id: string
  date: string
  stressLevel: StressLevel
  notes?: string
  triggers?: string[]
}

export interface AppetiteEntry {
  id: string
  date: string
  waterIntake: number // in glasses/cups
  meals: MealEntry[]
  notes?: string
}

export interface MealEntry {
  id: string
  time: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  description: string
  rating?: 1 | 2 | 3 | 4 | 5
}

export interface JournalEntry {
  id: string
  date: string // yyyy-MM-dd (calendar day for this entry)
  title: string
  content: string
  mood?: MoodLevel
  tags?: string[]
  /** ISO timestamp so multiple entries on the same day sort consistently */
  createdAt?: string
}

export interface UserPreferences {
  petType: PetType
  petName?: string
  theme: Theme
}

export interface SleepEntry {
  id: string
  date: string
  hours: number
  quality: 1 | 2 | 3 | 4 | 5 // 1 = poor, 5 = excellent
  notes?: string
  bedtime?: string
  wakeTime?: string
}

export interface MoodStats {
  average: number
  trend: 'up' | 'down' | 'stable'
  totalEntries: number
}

export interface TodoTask {
  id: string
  title: string
  description?: string
  importance: 'low' | 'medium' | 'high'
  dueDate?: string // yyyy-MM-dd
  dueTime?: string // HH:mm
  completed: boolean
  createdAt: string
  completedAt?: string
}

export type CalendarView = 'monthly' | 'weekly'
export type CalendarFilter = 'all' | 'mood' | 'stress' | 'sleep' | 'appetite' | 'exercise'

/** Light-touch movement logging for wellbeing (not a fitness app). */
export type ExerciseKind = 'walk' | 'stretch' | 'dance' | 'gentle' | 'other'

export interface ExerciseEntry {
  id: string
  date: string
  minutes: number
  kind: ExerciseKind
  note?: string
}

/** Personal milestones and reminders (birthdays, holidays, exams, etc.) — separate from the wellness data calendar. */
export interface ImportantDayEntry {
  id: string
  title: string
  date: string // yyyy-MM-dd
  time?: string // HH:mm
  description?: string
}

