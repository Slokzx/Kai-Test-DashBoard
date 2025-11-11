import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Alert, Stack } from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ComparisonDrawer } from '../components/lists/ComparisonDrawer'
import { VulnerabilityList } from '../components/lists/VulnerabilityList'
import { FilterPanel } from '../components/filters/FilterPanel'
import { SeverityChart } from '../components/charts/SeverityChart'
import { RiskFactorChart } from '../components/charts/RiskFactorChart'
import { TrendChart } from '../components/charts/TrendChart'
import { AiManualChart } from '../components/charts/AiManualChart'
import { CriticalCallouts } from '../components/insights/CriticalCallouts'
import { MetricCard } from '../components/insights/MetricCard'
import { Loader } from '../components/layout/Loader'
import { useFilters } from '../context/FilterContext'
import { usePreferences } from '../context/PreferencesContext'
import { useDebounce } from '../hooks/useDebounce'
import { useVulnerabilityData } from '../hooks/useVulnerabilityData'
import type { VulnerabilityRecord } from '../types/vulnerability'
import { applyFilters } from '../utils/filtering'
import { buildMetrics } from '../utils/metrics'

const getRiskFactors = (records: VulnerabilityRecord[]) => {
  const freq: Record<string, number> = {}
  records.forEach((record) => {
    record.riskFactors.forEach((factor) => {
      freq[factor] = (freq[factor] ?? 0) + 1
    })
  })
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([factor]) => factor)
    .slice(0, 10)
}

const getGroups = (records: VulnerabilityRecord[]) => {
  const set = new Set<string>()
  records.forEach((record) => set.add(record.group))
  return Array.from(set)
}

const getRepos = (records: VulnerabilityRecord[]) => {
  const set = new Set<string>()
  records.forEach((record) => set.add(record.repo))
  return Array.from(set)
}

const getSuggestions = (records: VulnerabilityRecord[], searchTerm: string) => {
  const term = searchTerm.toLowerCase()
  if (!term) {
    return records.slice(0, 5).map((record) => record.cve)
  }
  const candidates = records.filter(
    (record) =>
      record.cve.toLowerCase().includes(term) ||
      record.packageName.toLowerCase().includes(term) ||
      record.repo.toLowerCase().includes(term),
  )
  return candidates.slice(0, 5).map((record) => record.cve)
}

const formatPercent = (value: number) => `${Math.round(value * 100)}%`

const Dashboard = () => {
  const { data, isLoading, error, loaded } = useVulnerabilityData()
  const { state } = useFilters()
  const { preferences } = usePreferences()
  const navigate = useNavigate()
  const debouncedSearch = useDebounce(state.searchTerm, 200)

  const dataset: VulnerabilityRecord[] = data ?? []

  const { records, removed } = useMemo(
    () => applyFilters(dataset, state),
    [dataset, state],
  )

  const metrics = useMemo(() => buildMetrics(records, removed), [records, removed])

  const suggestions = useMemo(
    () => getSuggestions(dataset, debouncedSearch),
    [dataset, debouncedSearch],
  )

  const riskFactorOptions = useMemo(() => getRiskFactors(dataset), [dataset])
  const groupOptions = useMemo(() => getGroups(dataset), [dataset])
  const repoOptions = useMemo(() => getRepos(dataset), [dataset])

  const handleOpenDetail = (record: VulnerabilityRecord) => navigate(`/vulnerability/${record.cve}`)

  if (isLoading) {
    return <Loader label={`Streaming ${loaded} findings...`} />
  }

  if (error) {
    return (
      <Alert severity="error" icon={<WarningAmberIcon />}>
        Failed to load vulnerability data: {(error as Error).message}
      </Alert>
    )
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FilterPanel
            riskFactorOptions={riskFactorOptions}
            groupOptions={groupOptions}
            repoOptions={repoOptions}
            suggestions={suggestions}
            removedCount={removed}
          />
        </Grid>
        <Grid item xs={12} md={8} display="flex" flexDirection="column" gap={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                label="In scope"
                value={records.length}
                helper={`${dataset.length} total`}
                trend={{
                  value: dataset.length
                    ? Math.round((removed / dataset.length) * 100)
                    : 0,
                  label: 'noise reduction',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                label="Exploitable"
                value={metrics.exploitableCount}
                helper={`${formatPercent(
                  records.length ? metrics.exploitableCount / records.length : 0,
                )} of filtered set`}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                label="Median CVSS"
                value={metrics.medianCvss.toFixed(1)}
                helper="Median of filtered dataset"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                label="Kai status focus"
                value={state.kaiMode}
                helper={`Default: ${preferences.defaultKaiMode}`}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <SeverityChart metrics={metrics} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RiskFactorChart metrics={metrics} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TrendChart metrics={metrics} />
            </Grid>
            <Grid item xs={12} md={6}>
              <AiManualChart records={records} />
            </Grid>
          </Grid>
          <CriticalCallouts records={records} />
        </Grid>
      </Grid>

      <VulnerabilityList
        records={records}
        density={state.density}
        onOpenDetail={handleOpenDetail}
      />

      <ComparisonDrawer />
    </Stack>
  )
}

export default Dashboard
