import { createContext, useContext, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { VulnerabilityRecord } from '../types/vulnerability'

interface ComparisonContextValue {
  selections: VulnerabilityRecord[]
  includes: (id: string) => boolean
  toggle: (record: VulnerabilityRecord) => void
  remove: (id: string) => void
  clear: () => void
}

const ComparisonContext = createContext<ComparisonContextValue | undefined>(
  undefined,
)

export const ComparisonProvider = ({ children }: PropsWithChildren) => {
  const [selected, setSelected] = useState<Map<string, VulnerabilityRecord>>(
    new Map(),
  )

  const toggle = (record: VulnerabilityRecord) => {
    setSelected((prev) => {
      const next = new Map(prev)
      if (next.has(record.id)) {
        next.delete(record.id)
      } else {
        next.set(record.id, record)
      }
      return next
    })
  }

  const remove = (id: string) => {
    setSelected((prev) => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }

  const clear = () => setSelected(new Map())

  const value = useMemo<ComparisonContextValue>(
    () => ({
      selections: Array.from(selected.values()),
      includes: (id: string) => selected.has(id),
      toggle,
      remove,
      clear,
    }),
    [selected],
  )

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  )
}

export const useComparison = () => {
  const context = useContext(ComparisonContext)
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider')
  }
  return context
}
