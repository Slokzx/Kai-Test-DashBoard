import Papa from 'papaparse'
import type { VulnerabilityRecord } from '../types/vulnerability'

const pick = (record: VulnerabilityRecord) => ({
  cve: record.cve,
  title: record.title,
  severity: record.severity,
  cvss: record.cvss,
  kaiStatus: record.kaiStatus,
  group: record.group,
  repo: record.repo,
  exploitAvailable: record.exploitAvailable,
  published: record.published,
})

const triggerDownload = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const exportVulnerabilities = (
  records: VulnerabilityRecord[],
  format: 'json' | 'csv',
) => {
  if (!records.length) return
  if (format === 'json') {
    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: 'application/json',
    })
    triggerDownload(blob, `vulnerabilities-${Date.now()}.json`)
    return
  }

  const csv = Papa.unparse(records.map(pick))
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, `vulnerabilities-${Date.now()}.csv`)
}
