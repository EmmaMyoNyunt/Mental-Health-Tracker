import { Emotion } from '../types'

// Wide range of emotions organized by color/quadrant
export const EMOTIONS: Emotion[] = [
  // High Energy Positive (Yellow/Orange) - Excited, Happy, Energetic
  { valence: 2, arousal: 5, label: 'Elated', emoji: '🤩', color: 'yellow' },
  { valence: 2, arousal: 4, label: 'Excited', emoji: '😆', color: 'yellow' },
  { valence: 1, arousal: 5, label: 'Energetic', emoji: '⚡', color: 'yellow' },
  { valence: 1, arousal: 4, label: 'Happy', emoji: '😊', color: 'yellow' },
  { valence: 2, arousal: 3, label: 'Joyful', emoji: '😄', color: 'yellow' },
  { valence: 1, arousal: 3, label: 'Cheerful', emoji: '😃', color: 'yellow' },
  
  // High Energy Negative (Red) - Anxious, Angry, Stressed
  { valence: -2, arousal: 5, label: 'Panicked', emoji: '😱', color: 'red' },
  { valence: -2, arousal: 4, label: 'Angry', emoji: '😠', color: 'red' },
  { valence: -1, arousal: 5, label: 'Anxious', emoji: '😰', color: 'red' },
  { valence: -1, arousal: 4, label: 'Stressed', emoji: '😓', color: 'red' },
  { valence: -2, arousal: 3, label: 'Frustrated', emoji: '😤', color: 'red' },
  { valence: -1, arousal: 3, label: 'Worried', emoji: '😟', color: 'red' },
  { valence: -2, arousal: 2, label: 'Irritated', emoji: '😒', color: 'red' },
  
  // Low Energy Positive (Green) - Calm, Content, Peaceful
  { valence: 2, arousal: 2, label: 'Peaceful', emoji: '😌', color: 'green' },
  { valence: 2, arousal: 1, label: 'Serene', emoji: '🧘', color: 'green' },
  { valence: 1, arousal: 2, label: 'Content', emoji: '🙂', color: 'green' },
  { valence: 1, arousal: 1, label: 'Calm', emoji: '😇', color: 'green' },
  { valence: 2, arousal: 3, label: 'Relaxed', emoji: '😎', color: 'green' },
  { valence: 1, arousal: 3, label: 'Satisfied', emoji: '😊', color: 'green' },
  
  // Low Energy Negative (Blue) - Sad, Depressed, Tired
  { valence: -2, arousal: 2, label: 'Depressed', emoji: '😔', color: 'blue' },
  { valence: -2, arousal: 1, label: 'Empty', emoji: '😑', color: 'blue' },
  { valence: -1, arousal: 2, label: 'Sad', emoji: '😢', color: 'blue' },
  { valence: -1, arousal: 1, label: 'Tired', emoji: '😴', color: 'blue' },
  { valence: -2, arousal: 3, label: 'Melancholy', emoji: '😞', color: 'blue' },
  { valence: -1, arousal: 3, label: 'Lonely', emoji: '😕', color: 'blue' },
  { valence: -1, arousal: 0, label: 'Exhausted', emoji: '😫', color: 'blue' },
  
  // Neutral (Gray)
  { valence: 0, arousal: 3, label: 'Neutral', emoji: '😐', color: 'gray' },
  { valence: 0, arousal: 2, label: 'Indifferent', emoji: '😶', color: 'gray' },
  { valence: 0, arousal: 4, label: 'Alert', emoji: '👀', color: 'gray' },
  { valence: 0, arousal: 1, label: 'Bored', emoji: '🥱', color: 'gray' },
]

export type EmotionColor = 'yellow' | 'red' | 'green' | 'blue' | 'gray'

export interface EmotionWithColor extends Emotion {
  color: EmotionColor
}

export const getEmotionById = (id: string): Emotion | undefined => {
  return EMOTIONS.find(e => `${e.emoji}-${e.label}` === id)
}

export const getEmotionsByColor = () => {
  return {
    yellow: EMOTIONS.filter(e => e.color === 'yellow'),
    red: EMOTIONS.filter(e => e.color === 'red'),
    green: EMOTIONS.filter(e => e.color === 'green'),
    blue: EMOTIONS.filter(e => e.color === 'blue'),
    gray: EMOTIONS.filter(e => e.color === 'gray'),
  }
}

export const getColorClasses = (color: EmotionColor) => {
  const classes = {
    yellow: 'bg-yellow-200 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400',
    red: 'bg-red-200 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400',
    green: 'bg-green-200 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400',
    blue: 'bg-blue-200 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400',
    gray: 'bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300',
  }
  return classes[color]
}
