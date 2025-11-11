import type {
  FilterState,
  SortOption,
  VulnerabilityRecord,
} from '../types/vulnerability'
import { severitySortValue } from './metrics'

const matchesSearch = (record: VulnerabilityRecord, searchTerm: string) => {
  if (!searchTerm.trim()) return true
  const haystack = (
    record.cve +
    record.title +
    record.summary +
    record.packageName +
    record.repo +
    record.group +
    record.tags.join(' ')
  ).toLowerCase()
  const tokens = searchTerm.toLowerCase().split(/\s+/).filter(Boolean)
  return tokens.every((token) => haystack.includes(token))
}

const matchesPublishedRange = (
  record: VulnerabilityRecord,
  [from, to]: FilterState['publishedRange'],
) => {
  if (!from && !to) return true
  const published = new Date(record.published).getTime()
  if (from && published < new Date(from).getTime()) return false
  if (to && published > new Date(to).getTime()) return false
  return true
}

const matchesKaiMode = (record: VulnerabilityRecord, filters: FilterState) => {
  if (filters.excludeKaiStatuses.has(record.kaiStatus)) return false
  if (filters.kaiMode === 'analysis') {
    return record.kaiStatus !== 'invalid - norisk'
  }
  if (filters.kaiMode === 'ai-analysis') {
    return record.kaiStatus !== 'ai-invalid-norisk'
  }
  return true
}

const defaultSort: SortOption = { field: 'cvss', direction: 'desc' }

const sortRecords = (
  records: VulnerabilityRecord[],
  sort: SortOption = defaultSort,
) => {
  const direction = sort.direction === 'asc' ? 1 : -1
  return [...records].sort((a, b) => {
    switch (sort.field) {
      case 'published':
        return (
          (new Date(a.published).getTime() - new Date(b.published).getTime()) *
          direction
        )
      case 'severity':
        return (
          (severitySortValue(a.severity) - severitySortValue(b.severity)) *
          direction
        )
      case 'aiConfidence':
        return (a.aiConfidence - b.aiConfidence) * direction
      case 'cvss':
      default:
        return (a.cvss - b.cvss) * direction
    }
  })
}

export const applyFilters = (
  records: VulnerabilityRecord[],
  filters: FilterState,
) => {
  const filtered = records.filter((record) => {
    if (!matchesSearch(record, filters.searchTerm)) return false
    if (
      filters.severities.size > 0 &&
      !filters.severities.has(record.severity)
    )
      return false
    if (filters.riskFactors.size > 0) {
      const hasAll = Array.from(filters.riskFactors).every((risk) =>
        record.riskFactors.includes(risk),
      )
      if (!hasAll) return false
    }
    if (filters.groups.size > 0 && !filters.groups.has(record.group)) return false
    if (filters.repos.size > 0 && !filters.repos.has(record.repo)) return false
    if (filters.showExploitableOnly && !record.exploitAvailable) return false
    if (
      record.cvss < filters.cvssRange[0] ||
      record.cvss > filters.cvssRange[1]
    )
      return false
    if (!matchesPublishedRange(record, filters.publishedRange)) return false
    if (!matchesKaiMode(record, filters)) return false
    return true
  })

  return {
    records: sortRecords(filtered, filters.sort),
    removed: records.length - filtered.length,
  }
}
