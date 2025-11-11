import { createContext, useContext, useMemo, useReducer } from 'react'
import type {
  FilterContextValue,
  FilterState,
  KaiStatus,
  Severity,
  SortOption,
} from '../types/vulnerability'

const initialState: FilterState = {
  searchTerm: '',
  severities: new Set(),
  riskFactors: new Set(),
  kaiMode: 'all',
  excludeKaiStatuses: new Set(),
  groups: new Set(),
  repos: new Set(),
  showExploitableOnly: false,
  cvssRange: [0, 10],
  publishedRange: [null, null],
  sort: { field: 'cvss', direction: 'desc' },
  density: 'comfortable',
}

type Action =
  | { type: 'search'; payload: string }
  | { type: 'toggleSeverity'; payload: Severity }
  | { type: 'toggleRisk'; payload: string }
  | { type: 'toggleRepo'; payload: string }
  | { type: 'toggleGroup'; payload: string }
  | { type: 'toggleKai'; payload: KaiStatus }
  | { type: 'setKaiMode'; payload: FilterState['kaiMode'] }
  | { type: 'setCvssRange'; payload: [number, number] }
  | { type: 'setPublishedRange'; payload: [string | null, string | null] }
  | { type: 'toggleExploitable' }
  | { type: 'setSort'; payload: SortOption }
  | { type: 'setDensity'; payload: FilterState['density'] }
  | { type: 'reset' }

const toggleSet = <T,>(set: Set<T>, value: T) => {
  const next = new Set(set)
  if (next.has(value)) {
    next.delete(value)
  } else {
    next.add(value)
  }
  return next
}

const reducer = (state: FilterState, action: Action): FilterState => {
  switch (action.type) {
    case 'search':
      return { ...state, searchTerm: action.payload }
    case 'toggleSeverity':
      return { ...state, severities: toggleSet(state.severities, action.payload) }
    case 'toggleRisk':
      return { ...state, riskFactors: toggleSet(state.riskFactors, action.payload) }
    case 'toggleRepo':
      return { ...state, repos: toggleSet(state.repos, action.payload) }
    case 'toggleGroup':
      return { ...state, groups: toggleSet(state.groups, action.payload) }
    case 'toggleKai':
      return {
        ...state,
        excludeKaiStatuses: toggleSet(state.excludeKaiStatuses, action.payload),
      }
    case 'setKaiMode':
      return { ...state, kaiMode: action.payload }
    case 'setCvssRange':
      return { ...state, cvssRange: action.payload }
    case 'setPublishedRange':
      return { ...state, publishedRange: action.payload }
    case 'toggleExploitable':
      return { ...state, showExploitableOnly: !state.showExploitableOnly }
    case 'setSort':
      return { ...state, sort: action.payload }
    case 'setDensity':
      return { ...state, density: action.payload }
    case 'reset':
      return { ...initialState, density: state.density }
    default:
      return state
  }
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = useMemo<FilterContextValue>(() => ({
    state,
    updateSearch: (term: string) => dispatch({ type: 'search', payload: term }),
    toggleSeverity: (severity: Severity) =>
      dispatch({ type: 'toggleSeverity', payload: severity }),
    toggleRiskFactor: (risk: string) =>
      dispatch({ type: 'toggleRisk', payload: risk }),
    toggleRepo: (repo: string) => dispatch({ type: 'toggleRepo', payload: repo }),
    toggleGroup: (group: string) =>
      dispatch({ type: 'toggleGroup', payload: group }),
    toggleKaiExclusion: (status: KaiStatus) =>
      dispatch({ type: 'toggleKai', payload: status }),
    setKaiMode: (mode) => dispatch({ type: 'setKaiMode', payload: mode }),
    setCvssRange: (range) => dispatch({ type: 'setCvssRange', payload: range }),
    setPublishedRange: (range) =>
      dispatch({ type: 'setPublishedRange', payload: range }),
    toggleExploitable: () => dispatch({ type: 'toggleExploitable' }),
    setSort: (sort: SortOption) => dispatch({ type: 'setSort', payload: sort }),
    setDensity: (density) => dispatch({ type: 'setDensity', payload: density }),
    reset: () => dispatch({ type: 'reset' }),
  }), [state])

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

export const useFilters = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider')
  }
  return context
}
