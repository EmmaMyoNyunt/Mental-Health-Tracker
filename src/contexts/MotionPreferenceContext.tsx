import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'

export type MotionPreference = 'system' | 'reduce' | 'allow'

const STORAGE_KEY = 'moodGarden_motion_preference'

interface MotionPreferenceContextType {
  preference: MotionPreference
  setPreference: (p: MotionPreference) => void
  /** True when animations should be minimized */
  reducedMotion: boolean
}

const MotionPreferenceContext = createContext<MotionPreferenceContextType | undefined>(undefined)

function getStoredPreference(): MotionPreference | null {
  const v = localStorage.getItem(STORAGE_KEY)
  if (v === 'system' || v === 'reduce' || v === 'allow') return v
  return null
}

export const MotionPreferenceProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] = useState<MotionPreference>(() => getStoredPreference() ?? 'system')
  const [systemPrefersReduce, setSystemPrefersReduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setSystemPrefersReduce(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const reducedMotion = useMemo(() => {
    if (preference === 'reduce') return true
    if (preference === 'allow') return false
    return systemPrefersReduce
  }, [preference, systemPrefersReduce])

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion)
  }, [reducedMotion])

  const setPreference = useCallback((p: MotionPreference) => {
    setPreferenceState(p)
    localStorage.setItem(STORAGE_KEY, p)
  }, [])

  return (
    <MotionPreferenceContext.Provider value={{ preference, setPreference, reducedMotion }}>
      {children}
    </MotionPreferenceContext.Provider>
  )
}

export const useMotionPreference = () => {
  const ctx = useContext(MotionPreferenceContext)
  if (!ctx) throw new Error('useMotionPreference must be used within MotionPreferenceProvider')
  return ctx
}
