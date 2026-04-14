import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { isSameDay, format } from 'date-fns'
import { Lightbulb, Heart, Moon, UtensilsCrossed, AlertCircle, BookOpen, Footprints } from 'lucide-react'
import { MoodEntry, StressEntry, AppetiteEntry, SleepEntry, JournalEntry, ExerciseEntry } from '../types'

interface MindfulTipsProps {
  moodEntries: MoodEntry[]
  stressEntries: StressEntry[]
  appetiteEntries: AppetiteEntry[]
  sleepEntries: SleepEntry[]
  journalEntries: JournalEntry[]
  exerciseEntries: ExerciseEntry[]
}

const MindfulTips = ({ moodEntries, stressEntries, appetiteEntries, sleepEntries, journalEntries, exerciseEntries }: MindfulTipsProps) => {
  const today = new Date()

  const todayMood = moodEntries.find(e => isSameDay(new Date(e.date), today))
  const todayStress = stressEntries.find(e => isSameDay(new Date(e.date), today))
  const todayAppetite = appetiteEntries.find(e => isSameDay(new Date(e.date), today))
  const todaySleep = sleepEntries.find(e => isSameDay(new Date(e.date), today))
  const todayJournal = journalEntries.find(e => isSameDay(new Date(e.date), today))
  const todayStr = format(today, 'yyyy-MM-dd')
  const todayMovementMinutes = exerciseEntries
    .filter((e) => e.date === todayStr)
    .reduce((s, e) => s + e.minutes, 0)

  const tips = useMemo(() => {
    const tipsList: string[] = []

    // Mood-based tips
    if (todayMood) {
      if (todayMood.valence !== undefined && todayMood.arousal !== undefined) {
        // High arousal + negative (anxious, stressed, angry)
        if (todayMood.arousal >= 4 && todayMood.valence < 0) {
          tipsList.push('Try some deep breathing exercises - breathe in for 4 counts, hold for 4, and out for 4')
          tipsList.push('Consider a short mindfulness or meditation session to help calm your mind')
          tipsList.push('Take a gentle walk outside if possible - movement can help regulate emotions')
        }
        // Low arousal + negative (sad, depressed, tired)
        else if (todayMood.arousal <= 2 && todayMood.valence < 0) {
          tipsList.push('Try to get some natural light exposure - even a few minutes can help')
          tipsList.push('Make sure you\'re staying hydrated - dehydration can affect mood')
          tipsList.push('Consider reaching out to someone you trust - connection can help')
        }
        // High arousal + positive (excited, happy)
        else if (todayMood.arousal >= 4 && todayMood.valence > 0) {
          tipsList.push('Great to see you\'re feeling energetic. Channel this into something positive')
          tipsList.push('Consider journaling about what is making you feel good today')
        }
        // Low arousal + positive (calm, content)
        else if (todayMood.arousal <= 2 && todayMood.valence > 0) {
          tipsList.push('You seem to be in a peaceful state - enjoy this moment of calm')
        }
      }
    } else {
      tipsList.push('Consider tracking your mood today to better understand your emotional patterns')
    }

    // Sleep-based tips
    if (todaySleep) {
      if (todaySleep.hours < 7) {
        tipsList.push('You got less than 7 hours of sleep - try to aim for 7-9 hours for better wellbeing')
        tipsList.push('Consider establishing a regular bedtime routine to improve sleep quality')
      } else if (todaySleep.hours > 9) {
        tipsList.push('You got more than 9 hours - make sure you\'re not oversleeping regularly')
      }
      if (todaySleep.quality <= 2) {
        tipsList.push('Poor sleep quality can affect your mood - try limiting screens before bed')
        tipsList.push('Avoid caffeine in the afternoon and evening to improve sleep quality')
      }
    } else {
      tipsList.push('Tracking your sleep can help identify patterns that affect your mental health')
    }

    // Stress-based tips
    if (todayStress) {
      if (todayStress.stressLevel >= 4) {
        tipsList.push('High stress detected - try the 5-4-3-2-1 grounding technique: notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste')
        tipsList.push('Take regular breaks throughout the day - even 5 minutes can help')
        tipsList.push('Writing down your stress triggers can help you understand and manage them better')
      }
    } else {
      tipsList.push('Tracking stress levels can help you identify patterns and triggers')
    }

    // Gentle movement (wellbeing, not fitness)
    if (todayMovementMinutes === 0) {
      tipsList.push('A short movement break (even 5-10 minutes) can lift energy and soften stress - walk, stretch, or put on a song and move')
    } else if (todayMovementMinutes < 15) {
      tipsList.push('You have already moved today - if you have another minute, a quick stretch or walk can reinforce that win')
    }
    if (todayStress && todayStress.stressLevel >= 3 && todayMovementMinutes < 10) {
      tipsList.push('Pairing movement with stress spikes often helps - try pacing, shoulder rolls, or stepping outside between tasks')
    }

    // Appetite-based tips
    if (todayAppetite) {
      if (todayAppetite.waterIntake < 6) {
        tipsList.push('You have had less than 6 glasses of water - staying hydrated is important for mental health')
      }
      if (!todayAppetite.meals || todayAppetite.meals.length < 2) {
        tipsList.push('Regular meals help maintain stable energy and mood throughout the day')
      }
    } else {
      tipsList.push('Tracking your food and water intake can help you see connections with your mood and energy')
    }

    // Journaling tips
    if (!todayJournal) {
      tipsList.push('Consider journaling today - writing about your thoughts and feelings can be helpful')
      tipsList.push('Even a few sentences about your day can help process emotions')
    }

    // General wellness tips (always show a few)
    const generalTips = [
      'Small, consistent actions for your wellbeing add up over time',
      'Spending time in nature, even briefly, can boost your mood',
      'Listening to calming music can help reduce stress and anxiety',
      'Consider taking regular breaks from screens and social media',
      'Maintaining social connections is important for mental health',
      'Regular physical activity, even gentle movement, supports mental wellbeing',
      'Mindfulness practices do not have to be long - even 2-3 minutes can help',
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
  }, [todayMood, todayStress, todayAppetite, todaySleep, todayJournal, todayMovementMinutes])

  return (
    <div className="page-shell animate-fade-in">
      <div className="mb-8">
        <h2 className="mb-2 flex items-center gap-3 text-2xl font-bold text-heading">
          <Lightbulb className="text-primary-600 dark:text-primary-400" size={28} />
          Mindful tips
        </h2>
        <p className="text-muted">
          Personalized suggestions based on your tracking data
        </p>
        <p className="mt-2 text-sm text-faint">
          Tips are general suggestions, not medical advice.
        </p>
      </div>

      {/* Today's Summary */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h3 className="mb-4 text-lg font-semibold text-heading">Today&apos;s summary</h3>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div className="surface-chip rounded-xl p-3 text-center">
            <Heart className={`mx-auto mb-2 ${todayMood ? 'text-primary-600 dark:text-primary-400' : 'text-stone-300 dark:text-slate-700'}`} size={24} />
            <p className="text-xs text-muted">Mood</p>
            <p className="text-sm font-semibold text-heading">
              {todayMood ? 'Logged' : '—'}
            </p>
          </div>
          <div className="surface-chip rounded-xl p-3 text-center">
            <AlertCircle className={`mx-auto mb-2 ${todayStress ? 'text-red-600 dark:text-red-400' : 'text-stone-300 dark:text-slate-700'}`} size={24} />
            <p className="text-xs text-muted">Stress</p>
            <p className="text-sm font-semibold text-heading">
              {todayStress ? todayStress.stressLevel : '—'}
            </p>
          </div>
          <div className="surface-chip rounded-xl p-3 text-center">
            <Moon className={`mx-auto mb-2 ${todaySleep ? 'text-blue-600 dark:text-blue-400' : 'text-stone-300 dark:text-slate-700'}`} size={24} />
            <p className="text-xs text-muted">Sleep</p>
            <p className="text-sm font-semibold text-heading">
              {todaySleep ? `${todaySleep.hours}h` : '—'}
            </p>
          </div>
          <div className="surface-chip rounded-xl p-3 text-center">
            <UtensilsCrossed className={`mx-auto mb-2 ${todayAppetite ? 'text-green-600 dark:text-green-400' : 'text-stone-300 dark:text-slate-700'}`} size={24} />
            <p className="text-xs text-muted">Appetite</p>
            <p className="text-sm font-semibold text-heading">
              {todayAppetite ? '✓' : '—'}
            </p>
          </div>
          <div className="surface-chip rounded-xl p-3 text-center">
            <Footprints className={`mx-auto mb-2 ${todayMovementMinutes > 0 ? 'text-teal-600 dark:text-teal-400' : 'text-stone-300 dark:text-slate-700'}`} size={24} />
            <p className="text-xs text-muted">Movement</p>
            <p className="text-sm font-semibold text-heading">
              {todayMovementMinutes > 0 ? `${todayMovementMinutes}m` : '—'}
            </p>
          </div>
          <div className="surface-chip rounded-xl p-3 text-center">
            <BookOpen className={`mx-auto mb-2 ${todayJournal ? 'text-purple-600 dark:text-purple-400' : 'text-stone-300 dark:text-slate-700'}`} size={24} />
            <p className="text-xs text-muted">Journal</p>
            <p className="text-sm font-semibold text-heading">
              {todayJournal ? '✓' : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h3 className="mb-4 text-lg font-semibold text-heading">Personalized tips for you</h3>
        {tips.length > 0 ? (
          <div className="space-y-3">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="rounded-xl border-l-4 border-primary-400 bg-white/80 p-4 dark:border-emerald-400/70 dark:bg-gradient-to-br dark:from-slate-900/95 dark:to-emerald-950/35"
              >
                <p className="text-body">{tip}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted">
            <p className="italic">No personalized tips yet.</p>
            <p className="mt-2 text-sm text-body">
              Next step:{' '}
              <Link to="/mood" className="font-medium text-primary-700 underline decoration-primary-400/50 dark:text-primary-300">
                Log your mood
              </Link>{' '}
              or{' '}
              <Link to="/sleep" className="font-medium text-primary-700 underline decoration-primary-400/50 dark:text-primary-300">
                log sleep
              </Link>{' '}
              — we&apos;ll tailor ideas from there.
            </p>
          </div>
        )}
      </div>

      {/* Resources */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h3 className="mb-4 text-xl font-semibold text-heading">Resources &amp; support</h3>
        <div className="space-y-3 text-sm">
          <p className="text-stone-700 dark:text-stone-200">
            If you&apos;re struggling with your mental health, remember that support is available.
          </p>
          <div className="mt-4 space-y-2">
            <a
              href="https://www2.hse.ie/mental-health/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border-2 border-emerald-400/45 bg-gradient-to-br from-white/90 via-emerald-50/80 to-violet-100/60 p-4 shadow-md shadow-emerald-900/10 transition-colors hover:border-teal-400/70 hover:from-emerald-50/95 hover:via-cyan-50/70 hover:to-fuchsia-100/50 dark:border-emerald-500/40 dark:bg-gradient-to-br dark:from-slate-900/95 dark:via-teal-950/40 dark:to-violet-950/45 dark:shadow-lg dark:shadow-black/30 dark:hover:border-emerald-400/60 dark:hover:from-slate-800/95 dark:hover:via-emerald-950/45 dark:hover:to-indigo-950/40"
            >
              <p className="font-semibold text-stone-900 dark:text-stone-50">HSE Mental Health Services</p>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">Information and support resources</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MindfulTips

