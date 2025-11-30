import { useMemo } from 'react'
import { format, isSameDay } from 'date-fns'
import { Lightbulb, Heart, Moon, UtensilsCrossed, AlertCircle, BookOpen } from 'lucide-react'
import { MoodEntry, StressEntry, AppetiteEntry, SleepEntry, JournalEntry } from '../types'

interface MindfulTipsProps {
  moodEntries: MoodEntry[]
  stressEntries: StressEntry[]
  appetiteEntries: AppetiteEntry[]
  sleepEntries: SleepEntry[]
  journalEntries: JournalEntry[]
}

const MindfulTips = ({ moodEntries, stressEntries, appetiteEntries, sleepEntries, journalEntries }: MindfulTipsProps) => {
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')

  const todayMood = moodEntries.find(e => isSameDay(new Date(e.date), today))
  const todayStress = stressEntries.find(e => isSameDay(new Date(e.date), today))
  const todayAppetite = appetiteEntries.find(e => isSameDay(new Date(e.date), today))
  const todaySleep = sleepEntries.find(e => isSameDay(new Date(e.date), today))
  const todayJournal = journalEntries.find(e => isSameDay(new Date(e.date), today))

  const tips = useMemo(() => {
    const tipsList: string[] = []

    // Mood-based tips
    if (todayMood) {
      if (todayMood.valence !== undefined && todayMood.arousal !== undefined) {
        // High arousal + negative (anxious, stressed, angry)
        if (todayMood.arousal >= 4 && todayMood.valence < 0) {
          tipsList.push('🌿 Try some deep breathing exercises - breathe in for 4 counts, hold for 4, and out for 4')
          tipsList.push('🧘 Consider a short mindfulness or meditation session to help calm your mind')
          tipsList.push('🚶 Take a gentle walk outside if possible - movement can help regulate emotions')
        }
        // Low arousal + negative (sad, depressed, tired)
        else if (todayMood.arousal <= 2 && todayMood.valence < 0) {
          tipsList.push('☀️ Try to get some natural light exposure - even a few minutes can help')
          tipsList.push('💧 Make sure you\'re staying hydrated - dehydration can affect mood')
          tipsList.push('📞 Consider reaching out to someone you trust - connection can help')
        }
        // High arousal + positive (excited, happy)
        else if (todayMood.arousal >= 4 && todayMood.valence > 0) {
          tipsList.push('✨ Great to see you\'re feeling energetic! Channel this into something positive')
          tipsList.push('📝 Consider journaling about what\'s making you feel good today')
        }
        // Low arousal + positive (calm, content)
        else if (todayMood.arousal <= 2 && todayMood.valence > 0) {
          tipsList.push('😌 You seem to be in a peaceful state - enjoy this moment of calm')
        }
      }
    } else {
      tipsList.push('📊 Consider tracking your mood today to better understand your emotional patterns')
    }

    // Sleep-based tips
    if (todaySleep) {
      if (todaySleep.hours < 7) {
        tipsList.push('😴 You got less than 7 hours of sleep - try to aim for 7-9 hours for better wellbeing')
        tipsList.push('🌙 Consider establishing a regular bedtime routine to improve sleep quality')
      } else if (todaySleep.hours > 9) {
        tipsList.push('💤 You got more than 9 hours - make sure you\'re not oversleeping regularly')
      }
      if (todaySleep.quality <= 2) {
        tipsList.push('🛏️ Poor sleep quality can affect your mood - try limiting screens before bed')
        tipsList.push('🍵 Avoid caffeine in the afternoon and evening to improve sleep quality')
      }
    } else {
      tipsList.push('🌙 Tracking your sleep can help identify patterns that affect your mental health')
    }

    // Stress-based tips
    if (todayStress) {
      if (todayStress.stressLevel >= 4) {
        tipsList.push('😰 High stress detected - try the 5-4-3-2-1 grounding technique: notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste')
        tipsList.push('💆 Take regular breaks throughout the day - even 5 minutes can help')
        tipsList.push('📝 Writing down your stress triggers can help you understand and manage them better')
      }
    } else {
      tipsList.push('📊 Tracking stress levels can help you identify patterns and triggers')
    }

    // Appetite-based tips
    if (todayAppetite) {
      if (todayAppetite.waterIntake < 6) {
        tipsList.push('💧 You\'ve had less than 6 glasses of water - staying hydrated is important for mental health')
      }
      if (!todayAppetite.meals || todayAppetite.meals.length < 2) {
        tipsList.push('🍽️ Regular meals help maintain stable energy and mood throughout the day')
      }
    } else {
      tipsList.push('🥗 Tracking your food and water intake can help you see connections with your mood and energy')
    }

    // Journaling tips
    if (!todayJournal) {
      tipsList.push('📔 Consider journaling today - writing about your thoughts and feelings can be helpful')
      tipsList.push('✍️ Even a few sentences about your day can help process emotions')
    }

    // General wellness tips (always show a few)
    const generalTips = [
      '🌱 Small, consistent actions for your wellbeing add up over time',
      '🌿 Spending time in nature, even briefly, can boost your mood',
      '🎵 Listening to calming music can help reduce stress and anxiety',
      '📱 Consider taking regular breaks from screens and social media',
      '🤝 Maintaining social connections is important for mental health',
      '🏃 Regular physical activity, even gentle movement, supports mental wellbeing',
      '🧘 Mindfulness practices don\'t have to be long - even 2-3 minutes can help',
    ]

    // Add 1-2 general tips if we have space
    const remainingSlots = Math.max(0, 8 - tipsList.length)
    for (let i = 0; i < Math.min(remainingSlots, 2); i++) {
      const randomTip = generalTips[Math.floor(Math.random() * generalTips.length)]
      if (!tipsList.includes(randomTip)) {
        tipsList.push(randomTip)
      }
    }

    return tipsList
  }, [todayMood, todayStress, todayAppetite, todaySleep, todayJournal])

  const hasData = todayMood || todayStress || todayAppetite || todaySleep || todayJournal

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-3">
          <span className="text-4xl">💡</span>
          <Lightbulb className="text-primary-600 dark:text-primary-400" size={32} />
          Mindful Tips
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Personalized suggestions based on your tracking data
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Tips are general suggestions. For professional support, visit{' '}
          <a 
            href="https://www2.hse.ie/mental-health/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            HSE Mental Health
          </a>
        </p>
      </div>

      {/* Today's Summary */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <span>📊</span>
          Today's Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
            <Heart className={`mx-auto mb-2 ${todayMood ? 'text-primary-600 dark:text-primary-400' : 'text-gray-300 dark:text-gray-600'}`} size={24} />
            <p className="text-xs text-gray-600 dark:text-gray-300">Mood</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {todayMood ? (todayMood.emotion?.emoji || '✓') : '—'}
            </p>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
            <AlertCircle className={`mx-auto mb-2 ${todayStress ? 'text-red-600 dark:text-red-400' : 'text-gray-300 dark:text-gray-600'}`} size={24} />
            <p className="text-xs text-gray-600 dark:text-gray-300">Stress</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {todayStress ? todayStress.stressLevel : '—'}
            </p>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
            <Moon className={`mx-auto mb-2 ${todaySleep ? 'text-blue-600 dark:text-blue-400' : 'text-gray-300 dark:text-gray-600'}`} size={24} />
            <p className="text-xs text-gray-600 dark:text-gray-300">Sleep</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {todaySleep ? `${todaySleep.hours}h` : '—'}
            </p>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
            <UtensilsCrossed className={`mx-auto mb-2 ${todayAppetite ? 'text-green-600 dark:text-green-400' : 'text-gray-300 dark:text-gray-600'}`} size={24} />
            <p className="text-xs text-gray-600 dark:text-gray-300">Appetite</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {todayAppetite ? '✓' : '—'}
            </p>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
            <BookOpen className={`mx-auto mb-2 ${todayJournal ? 'text-purple-600 dark:text-purple-400' : 'text-gray-300 dark:text-gray-600'}`} size={24} />
            <p className="text-xs text-gray-600 dark:text-gray-300">Journal</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {todayJournal ? '✓' : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <span>💡</span>
          Personalized Tips for You
        </h3>
        {tips.length > 0 ? (
          <div className="space-y-3">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="p-4 bg-white dark:bg-gray-700 rounded-xl border-l-4 border-primary-400 dark:border-primary-500"
              >
                <p className="text-gray-700 dark:text-gray-200">{tip}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-300 italic">
            Start tracking your mood, sleep, stress, and appetite to receive personalized tips!
          </p>
        )}
      </div>

      {/* Resources */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Resources & Support</h3>
        <div className="space-y-3 text-sm">
          <p className="text-gray-600 dark:text-gray-300">
            If you're struggling with your mental health, remember that support is available.
          </p>
          <div className="mt-4 space-y-2">
            <a
              href="https://www2.hse.ie/mental-health/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <p className="font-semibold text-primary-700 dark:text-primary-300">HSE Mental Health Services</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">Information and support resources</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MindfulTips

