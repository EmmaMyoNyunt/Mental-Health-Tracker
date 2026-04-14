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
          ? 'rounded-xl border border-emerald-400/35 bg-white/70 px-4 py-3 text-sm text-body shadow-sm dark:border-emerald-500/25 dark:bg-slate-900/60'
          : 'rounded-2xl border border-emerald-400/40 bg-gradient-to-r from-emerald-50/90 via-white/80 to-cyan-50/70 px-5 py-4 dark:border-emerald-500/30 dark:from-emerald-950/40 dark:via-slate-900/90 dark:to-slate-900/90'
      }
      role="region"
      aria-label="Privacy and data storage"
    >
      <div className={`flex gap-3 ${isFooter ? 'items-start' : 'items-start sm:items-center'}`}>
        <Shield
          className={`shrink-0 text-emerald-700 dark:text-emerald-400 ${isFooter ? 'mt-0.5 h-4 w-4' : 'h-5 w-5'}`}
          aria-hidden
        />
        <div className="min-w-0 space-y-1">
          <p className={`font-medium text-heading ${isFooter ? 'text-sm' : ''}`}>Privacy</p>
          <p className={isFooter ? 'text-xs text-muted leading-relaxed' : 'text-sm text-body'}>
            Stored on this device only; clearing browser data or site storage for this app removes it.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyStrip
