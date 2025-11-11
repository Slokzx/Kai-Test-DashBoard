import { Box, Card, CardContent, Chip, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: ReactNode
  helper?: string
  trend?: { value: number; label: string }
  accent?: 'critical' | 'default'
}

export const MetricCard = ({ label, value, helper, trend, accent = 'default' }: MetricCardProps) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="caption" color="text.secondary" textTransform="uppercase">
        {label}
      </Typography>
      <Box display="flex" alignItems="baseline" gap={1} mt={1.5}>
        <Typography variant="h4" fontWeight={700} color={accent === 'critical' ? 'error' : undefined}>
          {value}
        </Typography>
        {trend && (
          <Chip
            size="small"
            color={trend.value >= 0 ? 'error' : 'success'}
            label={`${trend.value > 0 ? '+' : ''}${trend.value}% ${trend.label}`}
          />
        )}
      </Box>
      {helper && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          {helper}
        </Typography>
      )}
    </CardContent>
  </Card>
)
