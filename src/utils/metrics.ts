import { parseISO } from 'date-fns'
import type {
  Severity,
  VulnerabilityMetrics,
  VulnerabilityRecord,
} from '../types/vulnerability'

const severityOrder: Severity[] = ['critical', 'high', 'medium', 'low']

const initSeverityDistribution = (): Record<Severity, number> => ({
  critical: 0,
  high: 0,
  medium: 0,
  low: 0,
})

export const buildMetrics = (
  records: VulnerabilityRecord[],
  filtersRemoved = 0,
): VulnerabilityMetrics => {
  const severityDistribution = initSeverityDistribution()
  const riskFactorFrequency: Record<string, number> = {}
  const openByKaiStatus: VulnerabilityMetrics['openByKaiStatus'] = {
    'invalid - norisk': 0,
    'ai-invalid-norisk': 0,
    'needs-review': 0,
    confirmed: 0,
    investigating: 0,
    'needs triage': 0,
    unpatched: 0,
  }
  const trendMap: Record<string, number> = {}
  const cvssValues: number[] = []
  let exploitableCount = 0

  records.forEach((record) => {
    severityDistribution[record.severity] += 1
    openByKaiStatus[record.kaiStatus] += 1
    cvssValues.push(record.cvss)
    if (record.exploitAvailable) exploitableCount += 1

    record.riskFactors.forEach((factor) => {
      riskFactorFrequency[factor] = (riskFactorFrequency[factor] ?? 0) + 1
    })

    const publishedMonth = formatMonth(record.published)
    trendMap[publishedMonth] = (trendMap[publishedMonth] ?? 0) + 1
  })

  const trend = Object.entries(trendMap)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, value]) => ({ date, value }))

  const medianCvss = computeMedian(cvssValues)

  return {
    total: records.length,
    severityDistribution,
    riskFactorFrequency,
    openByKaiStatus,
    trend,
    exploitableCount,
    medianCvss,
    filtersRemoved,
  }
}

const computeMedian = (values: number[]) => {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2
  }
  return sorted[mid]
}

const formatMonth = (value: string): string => {
  const date = parseISO(value)
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

export const severitySortValue = (severity: Severity) =>
  severityOrder.indexOf(severity)
