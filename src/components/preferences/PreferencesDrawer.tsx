import AnalyticsIcon from '@mui/icons-material/Analytics'
import InsertChartIcon from '@mui/icons-material/InsertChart'
import TuneIcon from '@mui/icons-material/Tune'
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControlLabel,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import type { ReactNode } from 'react'
import { useFilters } from '../../context/FilterContext'
import type { PreferencesState, ThemeMode } from '../../context/PreferencesContext'
import { usePreferences } from '../../context/PreferencesContext'

interface PreferencesDrawerProps {
  open: boolean
  onClose: () => void
}

const modeOptions: Array<{ value: PreferencesState['defaultKaiMode']; label: ReactNode }> = [
  { value: 'all', label: 'All findings' },
  { value: 'analysis', label: 'Manual analysis' },
  { value: 'ai-analysis', label: 'AI analysis' },
]

export const PreferencesDrawer = ({ open, onClose }: PreferencesDrawerProps) => {
  const { preferences, updatePreferences } = usePreferences()
  const { state, setDensity, setKaiMode } = useFilters()

  const handleThemeChange = (_: unknown, value: ThemeMode | null) => {
    if (value) updatePreferences({ themeMode: value })
  }

  const handleKaiModeChange = (_: unknown, value: PreferencesState['defaultKaiMode'] | null) => {
    if (value) updatePreferences({ defaultKaiMode: value })
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose} keepMounted>
      <Box sx={{ width: 360, p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TuneIcon fontSize="small" /> Dashboard preferences
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Personalize the analytics workspace without affecting shared filters.
          </Typography>
        </Box>

        <PreferenceSection title="Theme">
          <ToggleButtonGroup
            value={preferences.themeMode}
            exclusive
            onChange={handleThemeChange}
            fullWidth
            size="small"
          >
            <ToggleButton value="light">Light</ToggleButton>
            <ToggleButton value="dark">Dark</ToggleButton>
          </ToggleButtonGroup>
        </PreferenceSection>

        <PreferenceSection title="Default Kai analysis" icon={<AnalyticsIcon fontSize="small" />}>
          <ToggleButtonGroup
            value={preferences.defaultKaiMode}
            exclusive
            onChange={handleKaiModeChange}
            fullWidth
            size="small"
          >
            {modeOptions.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Button
            onClick={() => setKaiMode(preferences.defaultKaiMode)}
            sx={{ mt: 1 }}
            variant="outlined"
            size="small"
          >
            Apply to current view
          </Button>
        </PreferenceSection>

        <PreferenceSection title="Density" icon={<InsertChartIcon fontSize="small" />}>
          <ToggleButtonGroup
            value={state.density}
            exclusive
            onChange={(_, value) => value && setDensity(value)}
            fullWidth
            size="small"
          >
            <ToggleButton value="comfortable">Comfortable</ToggleButton>
            <ToggleButton value="compact">Compact</ToggleButton>
          </ToggleButtonGroup>
        </PreferenceSection>

        <PreferenceSection title="Highlights">
          <FormControlLabel
            control={
              <Switch
                checked={preferences.highlightCritical}
                onChange={(_, checked) =>
                  updatePreferences({ highlightCritical: checked })
                }
              />
            }
            label="Emphasize critical severity across UI"
          />
        </PreferenceSection>

        <Box mt="auto">
          <Button variant="contained" fullWidth onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

const PreferenceSection = ({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) => (
  <Stack spacing={1.5} divider={<Divider flexItem />}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {icon}
      <Typography variant="subtitle2" textTransform="uppercase" color="text.secondary" fontWeight={700}>
        {title}
      </Typography>
    </Box>
    <Box>{children}</Box>
  </Stack>
)
