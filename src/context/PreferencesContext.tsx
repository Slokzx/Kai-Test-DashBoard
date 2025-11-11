import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { PropsWithChildren } from 'react'

export type ThemeMode = 'light' | 'dark'

export interface PreferencesState {
  themeMode: ThemeMode
  showDensityToggle: boolean
  highlightCritical: boolean
  defaultKaiMode: 'all' | 'analysis' | 'ai-analysis'
}

const defaultPreferences: PreferencesState = {
  themeMode: 'light',
  showDensityToggle: true,
  highlightCritical: true,
  defaultKaiMode: 'all',
}

interface PreferencesContextValue {
  preferences: PreferencesState
  updatePreferences: (next: Partial<PreferencesState>) => void
}

const STORAGE_KEY = 'kai-dashboard-preferences'

const PreferencesContext = createContext<PreferencesContextValue | undefined>(
  undefined,
)

export const PreferencesProvider = ({ children }: PropsWithChildren) => {
  const [preferences, setPreferences] = useState<PreferencesState>(
    () => getInitialPreferences(),
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  }, [preferences])

  const updatePreferences = (next: Partial<PreferencesState>) => {
    setPreferences((prev) => ({ ...prev, ...next }))
  }

  const value = useMemo(
    () => ({ preferences, updatePreferences }),
    [preferences],
  )

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  )
}

const getInitialPreferences = (): PreferencesState => {
  if (typeof window === 'undefined') {
    return defaultPreferences
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.warn('Unable to parse stored preferences', error)
  }
  return defaultPreferences
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider')
  }
  return context
}
