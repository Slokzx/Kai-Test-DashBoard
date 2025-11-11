import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SecurityIcon from '@mui/icons-material/Security'
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { format, subDays } from 'date-fns'
import { useFilters } from '../../context/FilterContext'
import type { FilterState, Severity } from '../../types/vulnerability'
import { ActionButtons } from './ActionButtons'
import { SearchBar } from './SearchBar'

interface FilterPanelProps {
  riskFactorOptions: string[]
  groupOptions: string[]
  repoOptions: string[]
  suggestions: string[]
  removedCount: number
}

const severityPalette: Record<Severity, { label: string; color: 'error' | 'warning' | 'info' | 'success' }> = {
  critical: { label: 'Critical', color: 'error' },
  high: { label: 'High', color: 'warning' },
  medium: { label: 'Medium', color: 'info' },
  low: { label: 'Low', color: 'success' },
}

const sortOptions: Array<{ label: string; value: FilterState['sort'] }> = [
  { label: 'CVSS (desc)', value: { field: 'cvss', direction: 'desc' } },
  { label: 'CVSS (asc)', value: { field: 'cvss', direction: 'asc' } },
  { label: 'Published (newest)', value: { field: 'published', direction: 'desc' } },
  { label: 'Severity (critical first)', value: { field: 'severity', direction: 'asc' } },
  { label: 'AI confidence', value: { field: 'aiConfidence', direction: 'desc' } },
]

export const FilterPanel = ({
  riskFactorOptions,
  groupOptions,
  repoOptions,
  suggestions,
  removedCount,
}: FilterPanelProps) => {
  const {
    state,
    updateSearch,
    toggleSeverity,
    toggleRiskFactor,
    toggleGroup,
    toggleRepo,
    toggleExploitable,
    setCvssRange,
    setPublishedRange,
    setKaiMode,
    setSort,
    reset,
  } = useFilters()

  return (
    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box display="flex" alignItems="center" gap={1}>
        <SecurityIcon color="secondary" />
        <Typography variant="h6" fontWeight={600}>
          Security Controls
        </Typography>
        <Box flex={1} />
        <Button startIcon={<RestartAltIcon />} onClick={reset} size="small">
          Reset filters
        </Button>
      </Box>

      <SearchBar value={state.searchTerm} onChange={updateSearch} suggestions={suggestions} />

      <ActionButtons
        activeMode={state.kaiMode}
        onModeChange={setKaiMode}
        removedCount={removedCount}
      />

      <Divider flexItem />

      <Stack spacing={2}>
        <SectionLabel text="Severity" />
        <Box display="flex" flexWrap="wrap" gap={1}>
          {(Object.keys(severityPalette) as Severity[]).map((severity) => (
            <Chip
              key={severity}
              color={severityPalette[severity].color}
              variant={state.severities.has(severity) ? 'filled' : 'outlined'}
              label={severityPalette[severity].label}
              onClick={() => toggleSeverity(severity)}
            />
          ))}
        </Box>
      </Stack>

      <Stack spacing={2}>
        <SectionLabel text="Risk factors" />
        <Box display="flex" flexWrap="wrap" gap={1}>
          {riskFactorOptions.map((factor) => (
            <Chip
              key={factor}
              label={factor}
              variant={state.riskFactors.has(factor) ? 'filled' : 'outlined'}
              color={state.riskFactors.has(factor) ? 'secondary' : 'default'}
              onClick={() => toggleRiskFactor(factor)}
            />
          ))}
        </Box>
      </Stack>

      <Stack spacing={2}>
        <SectionLabel text="Teams & repos" />
        <SelectionGrid
          label="Group"
          options={groupOptions}
          selected={state.groups}
          onToggle={toggleGroup}
        />
        <SelectionGrid
          label="Repository"
          options={repoOptions}
          selected={state.repos}
          onToggle={toggleRepo}
        />
      </Stack>

      <Stack spacing={2}>
        <SectionLabel text="CVSS range" />
        <Slider
          min={0}
          max={10}
          step={0.1}
          value={[state.cvssRange[0], state.cvssRange[1]]}
          onChange={(_, value) => setCvssRange(value as [number, number])}
          marks={[{ value: 0, label: '0' }, { value: 10, label: '10' }]}
          valueLabelDisplay="auto"
        />
      </Stack>

      <Stack spacing={2}>
        <SectionLabel text="Published window" />
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="From"
            type="date"
            size="small"
            value={state.publishedRange[0] ?? ''}
            onChange={(event) =>
              setPublishedRange([event.target.value || null, state.publishedRange[1]])
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            value={state.publishedRange[1] ?? ''}
            onChange={(event) =>
              setPublishedRange([state.publishedRange[0], event.target.value || null])
            }
            InputLabelProps={{ shrink: true }}
          />
          <Button
            size="small"
            onClick={() =>
              setPublishedRange([
                format(subDays(new Date(), 30), 'yyyy-MM-dd'),
                format(new Date(), 'yyyy-MM-dd'),
              ])
            }
          >
            Last 30 days
          </Button>
        </Box>
      </Stack>

      <Stack spacing={2}>
        <SectionLabel text="Sort" />
        <FormControl size="small">
          <InputLabel id="sort-select-label">Order</InputLabel>
          <Select
            labelId="sort-select-label"
            label="Order"
            value={`${state.sort.field}-${state.sort.direction}`}
            onChange={(event) => {
              const option = sortOptions.find(
                (opt) => `${opt.value.field}-${opt.value.direction}` === event.target.value,
              )
              if (option) setSort(option.value)
            }}
          >
            {sortOptions.map((option) => (
              <MenuItem
                key={`${option.value.field}-${option.value.direction}`}
                value={`${option.value.field}-${option.value.direction}`}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Switch checked={state.showExploitableOnly} onChange={toggleExploitable} />
          }
          label="Show exploitable only"
        />
      </Stack>
    </Paper>
  )
}

const SectionLabel = ({ text }: { text: string }) => (
  <Typography variant="subtitle2" color="text.secondary" fontWeight={700} textTransform="uppercase">
    {text}
  </Typography>
)

const SelectionGrid = ({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: string[]
  selected: Set<string>
  onToggle: (value: string) => void
}) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          color={selected.has(option) ? 'secondary' : 'default'}
          variant={selected.has(option) ? 'filled' : 'outlined'}
          onClick={() => onToggle(option)}
        />
      ))}
    </Box>
  </Box>
)
