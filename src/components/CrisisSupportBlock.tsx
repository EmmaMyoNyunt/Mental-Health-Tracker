import { LifeBuoy, ExternalLink, Phone } from 'lucide-react'

/** Crisis & professional support — Ireland-focused; keep visible on Tips and Settings. */
const CrisisSupportBlock = () => {
  return (
    <div
      className="rounded-2xl border-2 border-rose-400/45 bg-gradient-to-br from-rose-50/95 via-orange-50/80 to-amber-50/60 p-5 shadow-md shadow-rose-900/10 dark:border-rose-500/35 dark:from-rose-950/50 dark:via-slate-900/95 dark:to-slate-950/90 dark:shadow-black/30"
      role="region"
      aria-label="Crisis and mental health support contacts"
    >
      <h3 className="flex items-center gap-2 text-lg font-semibold text-heading">
        <LifeBuoy className="shrink-0 text-rose-600 dark:text-rose-400" size={22} aria-hidden />
        Need support?
      </h3>
      <p className="mt-2 text-sm text-body">
        If you are in crisis or need to talk to someone straight away, you can reach these services free of charge
        (charges may apply to texts depending on your plan — check with your provider).
      </p>
      <ul className="mt-4 space-y-3 text-sm">
        <li>
          <a
            href="https://www2.hse.ie/mental-health/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-wrap items-start gap-2 rounded-xl border border-emerald-300/50 bg-white/80 px-3 py-2.5 text-body transition hover:border-emerald-400 dark:border-emerald-600/40 dark:bg-slate-800/80 dark:hover:border-emerald-500/60"
          >
            <ExternalLink size={16} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
            <span>
              <span className="font-semibold text-heading">HSE Mental Health</span>
              <span className="block text-xs text-muted">Information, services, and self-help resources</span>
            </span>
          </a>
        </li>
        <li className="flex flex-wrap items-center gap-2 rounded-xl border border-rose-200/80 bg-white/70 px-3 py-2.5 dark:border-rose-900/50 dark:bg-slate-800/70">
          <Phone size={16} className="shrink-0 text-rose-600 dark:text-rose-400" aria-hidden />
          <span className="text-body">
            <span className="font-semibold text-heading">Samaritans</span>
            {' — '}
            <a href="tel:116123" className="font-mono text-primary-700 underline decoration-primary-400/60 hover:decoration-primary-600 dark:text-primary-300">
              116 123
            </a>
            <span className="block text-xs text-muted">Freephone, 24 hours a day</span>
          </span>
        </li>
        <li className="flex flex-wrap items-center gap-2 rounded-xl border border-sky-200/80 bg-white/70 px-3 py-2.5 dark:border-sky-900/50 dark:bg-slate-800/70">
          <span className="text-lg" aria-hidden>
            💬
          </span>
          <span className="text-body">
            <span className="font-semibold text-heading">Crisis Text Line</span>
            {' — text '}
            <span className="font-mono font-semibold text-sky-800 dark:text-sky-200">50808</span>
            <span className="block text-xs text-muted">24/7 support by text (Ireland)</span>
          </span>
        </li>
      </ul>
      <p className="mt-4 text-xs text-faint">
        MoodGarden does not provide crisis counselling. For emergencies, call emergency services (999 or 112).
      </p>
    </div>
  )
}

export default CrisisSupportBlock
