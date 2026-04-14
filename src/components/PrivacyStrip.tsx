import { Shield } from 'lucide-react'

interface PrivacyStripProps {
  /** Page card (Settings) vs slim bar under main content */
  variant?: 'card' | 'footer'
}

/** Short ethics copy: local-only storage; browser clear removes data; export noted for later. */
const PrivacyStrip = ({ variant = 'card' }: PrivacyStripProps) => {
  const isFooter = variant === 'footer'

  return (
    <div
      className={
        isFooter
          ? 'rounded-xl border border-emerald-400/45 bg-white/90 px-4 py-3 text-sm shadow-sm dark:border-slate-500 dark:bg-slate-950 dark:ring-1 dark:ring-slate-600/40'
          : 'rounded-2xl border border-emerald-400/50 bg-gradient-to-r from-emerald-50/95 via-white/90 to-cyan-50/75 px-5 py-4 dark:border-slate-500 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:ring-1 dark:ring-slate-600/30'
      }
      role="region"
      aria-label="Privacy and data storage"
    >
      <div className={`flex gap-3 ${isFooter ? 'items-start' : 'items-start sm:items-center'}`}>
        <Shield
          className={`shrink-0 text-emerald-700 dark:text-emerald-300 ${isFooter ? 'mt-0.5 h-4 w-4' : 'h-5 w-5'}`}
          aria-hidden
        />
        <div className="min-w-0 space-y-1">
          <p className={`font-semibold text-stone-900 dark:text-stone-50 ${isFooter ? 'text-sm' : ''}`}>Privacy</p>
          <p
            className={
              isFooter
                ? 'text-xs leading-relaxed text-stone-600 dark:text-stone-300'
                : 'text-sm text-stone-700 dark:text-stone-300'
            }
          >
            Stored on this device only; clearing browser data or site storage for this app removes it.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyStrip
