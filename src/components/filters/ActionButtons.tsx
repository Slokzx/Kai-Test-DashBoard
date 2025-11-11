import ScienceIcon from '@mui/icons-material/Science'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { Box, Button, ButtonGroup, Tooltip, Typography } from '@mui/material'
import type { FilterState } from '../../types/vulnerability'
import { FilterImpact } from './FilterImpact'

interface ActionButtonsProps {
  activeMode: FilterState['kaiMode']
  onModeChange: (mode: FilterState['kaiMode']) => void
  removedCount: number
}

export const ActionButtons = ({ activeMode, onModeChange, removedCount }: ActionButtonsProps) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
    <ButtonGroup color="secondary" variant="outlined">
      <Tooltip title="Hide AI-invalidated findings to focus on triage-ready work">
        <Button
          startIcon={<ScienceIcon />}
          variant={activeMode === 'analysis' ? 'contained' : 'outlined'}
          onClick={() => onModeChange(activeMode === 'analysis' ? 'all' : 'analysis')}
        >
          Analysis
        </Button>
      </Tooltip>
      <Tooltip title="Hide manually invalidated findings and spotlight AI feedback">
        <Button
          startIcon={<SmartToyIcon />}
          variant={activeMode === 'ai-analysis' ? 'contained' : 'outlined'}
          onClick={() =>
            onModeChange(activeMode === 'ai-analysis' ? 'all' : 'ai-analysis')
          }
        >
          AI Analysis
        </Button>
      </Tooltip>
      <Tooltip title="Show everything regardless of Kai verdict">
        <Button
          startIcon={<SwapHorizIcon />}
          disabled={activeMode === 'all'}
          onClick={() => onModeChange('all')}
        >
          Reset
        </Button>
      </Tooltip>
    </ButtonGroup>
    <Box textAlign="right">
      <Typography variant="caption" color="text.secondary" display="block">
        Filter impact
      </Typography>
      <FilterImpact removed={removedCount} />
    </Box>
  </Box>
)
