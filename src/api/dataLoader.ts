import type {
  KaiStatus,
  RawVulnerability,
  Severity,
  VulnerabilityRecord,
} from '../types/vulnerability'

const DATA_URL = '/data/vulnerabilities.ndjson'

const severityWeight: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

const defaultTimeline = [{ label: 'Detected', date: new Date().toISOString() }]

const normalizeStatus = (status: string): KaiStatus => {
  const normalized = status.toLowerCase() as KaiStatus
  if (
    normalized === 'invalid - norisk' ||
    normalized === 'ai-invalid-norisk' ||
    normalized === 'needs-review' ||
    normalized === 'confirmed' ||
    normalized === 'investigating' ||
    normalized === 'needs triage'
  ) {
    return normalized
  }
  return 'unpatched'
}

const categorize = (raw: RawVulnerability): string => {
  if (raw.tags?.includes('service-mesh')) return 'Network & Mesh'
  if (raw.tags?.includes('hashicorp')) return 'Secrets Management'
  if (raw.tags?.includes('cicd')) return 'CI/CD'
  if (raw.tags?.includes('observability')) return 'Observability'
  if (raw.tags?.includes('ml')) return 'AI/ML'
  return 'Platform'
}

const toRecord = (raw: RawVulnerability): VulnerabilityRecord => {
  const severity = raw.severity ?? 'medium'
  const trendScore = raw.trendScore ?? 1
  const riskFactors = raw.riskFactors ?? []
  const impactScore = Math.round(
    severityWeight[severity] * 25 +
      riskFactors.length * 7 +
      (raw.exploitAvailable ? 18 : 0) +
      (raw.aiConfidence + raw.manualConfidence) * 10 +
      trendScore * 3,
  )

  return {
    id: raw.cve,
    cve: raw.cve,
    title: raw.title,
    summary: raw.summary,
    severity,
    cvss: raw.cvss,
    vector: raw.vector,
    published: raw.published,
    updated: raw.updated,
    riskFactors,
    exploitAvailable: raw.exploitAvailable,
    status: raw.status,
    kaiStatus: normalizeStatus(raw.kaiStatus),
    analysisSource: raw.analysisSource,
    aiConfidence: raw.aiConfidence,
    manualConfidence: raw.manualConfidence,
    group: raw.group,
    repo: raw.repo,
    image: raw.image,
    packageName: raw.packageName,
    packageVersion: raw.packageVersion,
    fixVersion: raw.fixVersion,
    trendScore,
    tags: raw.tags ?? [],
    references: raw.references ?? [],
    timeline: raw.timeline ?? defaultTimeline,
    impactScore,
    category: categorize(raw),
  }
}

async function* parseNdjson(response: Response): AsyncGenerator<RawVulnerability> {
  const reader = response.body?.getReader()
  if (!reader) return
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let boundary = buffer.indexOf('\n')
    while (boundary !== -1) {
      const line = buffer.slice(0, boundary).trim()
      buffer = buffer.slice(boundary + 1)
      if (line) {
        yield JSON.parse(line) as RawVulnerability
      }
      boundary = buffer.indexOf('\n')
    }
  }
  buffer += decoder.decode()
  const trimmed = buffer.trim()
  if (trimmed) {
    yield JSON.parse(trimmed) as RawVulnerability
  }
}

const parseAsJsonArray = async (response: Response) => {
  const text = await response.text()
  const parsed = JSON.parse(text)
  if (Array.isArray(parsed)) return parsed
  if (parsed && typeof parsed === 'object') {
    if ('groups' in parsed) {
      const groups = (parsed as any).groups as Record<string, any>
      const flattened: RawVulnerability[] = []
      Object.values(groups).forEach((group) => {
        Object.values(group.repos ?? {}).forEach((repo: any) => {
          Object.values(repo.images ?? {}).forEach((image: any) => {
            ;(image.vulnerabilities ?? []).forEach((vuln: any) => {
              flattened.push({
                ...vuln,
                group: group.name,
                repo: repo.name,
                image: image.name,
              })
            })
          })
        })
      })
      return flattened
    }
    if ('items' in parsed) return (parsed as any).items
  }
  return []
}

export interface LoadOptions {
  signal?: AbortSignal
  onChunk?: (count: number) => void
}

export const loadVulnerabilityDataset = async (
  options: LoadOptions = {},
): Promise<VulnerabilityRecord[]> => {
  const response = await fetch(DATA_URL, { signal: options.signal })
  if (!response.ok) {
    throw new Error('Unable to load vulnerability data')
  }

  const records: VulnerabilityRecord[] = []
  const contentType = response.headers.get('content-type') ?? ''
  const shouldStream =
    contentType.includes('ndjson') || DATA_URL.toLowerCase().endsWith('.ndjson')

  if (shouldStream && response.body) {
    // Consume the NDJSON stream incrementally to keep memory flat for 300MB+ files.
    for await (const raw of parseNdjson(response)) {
      records.push(toRecord(raw as RawVulnerability))
      options.onChunk?.(records.length)
    }
    return records
  }

  const parsed = await parseAsJsonArray(response)
  parsed.forEach((item: RawVulnerability, idx: number) => {
    records.push(toRecord(item))
    if ((idx + 1) % 50 === 0) {
      options.onChunk?.(idx + 1)
    }
  })
  return records
}

export const DATA_ENDPOINT = DATA_URL
