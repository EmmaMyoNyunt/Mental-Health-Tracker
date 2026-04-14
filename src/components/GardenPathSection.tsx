import { Link } from 'react-router-dom'
import { Moon, Heart, Footprints, ArrowRight, GitBranch, Sparkles, MessageCircle } from 'lucide-react'

const GardenPathSection = () => {
  const connections = [
    {
      title: 'Sleep and mood',
      body:
        'Poor sleep often goes hand in hand with low mood and higher stress the next day. When you log both, you can spot whether rough nights line up with harder days — without judging yourself.',
      from: 'Sleep',
      to: 'Mood',
      hrefSleep: '/sleep',
      hrefMood: '/mood',
    },
    {
      title: 'Movement and stress',
      body:
        'Gentle movement is not about fitness here — it is about giving your nervous system a small reset. Even a few minutes can sit alongside your stress logs so you see what helps.',
      from: 'Movement',
      to: 'Stress',
      hrefSleep: '/movement',
      hrefMood: '/stress',
    },
    {
      title: 'The full picture',
      body:
        'Appetite, journal entries, and your calendar add context: exams, busy weeks, or skipped meals. Together they tell a story that a single number never could.',
      from: 'Everything else',
      to: 'Insights',
      hrefSleep: '/appetite',
      hrefMood: '/insights',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <div className="mb-4 flex items-center gap-2">
          <GitBranch className="text-emerald-600 dark:text-emerald-400" size={24} aria-hidden />
          <h3 className="text-xl font-semibold text-heading">How your garden grows together</h3>
        </div>
        <p className="text-body">
          MoodGarden is built around a simple idea: your wellbeing is connected. Tracking more than one area helps you
          notice patterns — like how sleep, stress, and gentle movement relate — in plain language, at your own pace.
        </p>
        <div className="mt-5 flex gap-3 rounded-xl border border-teal-300/50 bg-teal-50/80 p-4 dark:border-teal-600/35 dark:bg-teal-950/35">
          <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden />
          <div className="text-sm text-body">
            <p className="font-medium text-heading">AI chatbot (bottom-right)</p>
            <p className="mt-1 text-muted">
              Use the floating button to open the assistant. It only offers <strong className="font-semibold text-heading">basic wellbeing tips</strong> drawn from{' '}
              <a
                href="https://www2.hse.ie/mental-health/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-700 underline decoration-primary-400/50 hover:text-primary-800 dark:text-primary-300"
              >
                HSE mental health information
              </a>{' '}
              that is publicly available — not personal medical advice or crisis support.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {connections.map((c) => (
          <div
            key={c.title}
            className="glass-effect flex flex-col rounded-2xl p-5 card-hover"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">{c.title}</p>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-medium text-heading">
              <Link
                to={c.hrefSleep}
                className="rounded-lg bg-emerald-100/90 px-2 py-1 text-emerald-900 transition hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-100 dark:hover:bg-emerald-900/50"
              >
                {c.from}
              </Link>
              <ArrowRight className="h-4 w-4 text-muted" aria-hidden />
              <Link
                to={c.hrefMood}
                className="rounded-lg bg-teal-100/90 px-2 py-1 text-teal-900 transition hover:bg-teal-200 dark:bg-teal-950/50 dark:text-teal-100 dark:hover:bg-teal-900/40"
              >
                {c.to}
              </Link>
            </div>
            <p className="flex-1 text-sm text-muted">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-heading">
          <Sparkles className="text-amber-500 dark:text-amber-400" size={20} aria-hidden />
          Where to start
        </h4>
        <ul className="space-y-2 text-sm text-body">
          <li className="flex items-start gap-2">
            <Moon className="mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-400" size={18} aria-hidden />
            <span>
              <Link to="/sleep" className="font-medium text-primary-700 underline decoration-primary-400/50 hover:text-primary-800 dark:text-primary-300">
                Log sleep
              </Link>{' '}
              when you can — it anchors the rest of your week.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Heart className="mt-0.5 shrink-0 text-rose-500 dark:text-rose-400" size={18} aria-hidden />
            <span>
              <Link to="/mood" className="font-medium text-primary-700 underline decoration-primary-400/50 hover:text-primary-800 dark:text-primary-300">
                Add mood
              </Link>{' '}
              on good days and hard days alike.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Footprints className="mt-0.5 shrink-0 text-teal-600 dark:text-teal-400" size={18} aria-hidden />
            <span>
              <Link to="/movement" className="font-medium text-primary-700 underline decoration-primary-400/50 hover:text-primary-800 dark:text-primary-300">
                Log a little movement
              </Link>{' '}
              — even five minutes counts.
            </span>
          </li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/insights"
            className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            Open Insights
            <ArrowRight size={16} aria-hidden />
          </Link>
          <Link
            to="/calendar"
            className="inline-flex items-center gap-1 rounded-lg surface-chip px-4 py-2 text-sm font-medium text-heading transition hover:opacity-90"
          >
            See calendar
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GardenPathSection
