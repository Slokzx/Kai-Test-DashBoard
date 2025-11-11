import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Chip, Typography } from '@mui/material'

interface FilterImpactProps {
  removed: number
}

export const FilterImpact = ({ removed }: FilterImpactProps) => (
  <Box display="flex" alignItems="center" gap={1}>
    <Chip
      size="small"
      color={removed > 0 ? 'primary' : 'default'}
      icon={removed > 0 ? <TrendingDownIcon /> : <TrendingUpIcon />}
      label={removed > 0 ? `${removed} findings suppressed` : 'Full dataset visible'}
    />
    {removed > 0 && (
      <Typography variant="caption" color="text.secondary">
        Reduced noise by {Math.min(99, Math.round((removed / (removed + 1)) * 100))}%
      </Typography>
    )}
  </Box>
)
