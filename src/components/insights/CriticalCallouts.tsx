import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Box, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material'
import type { VulnerabilityRecord } from '../../types/vulnerability'

interface CriticalCalloutsProps {
  records: VulnerabilityRecord[]
}

export const CriticalCallouts = ({ records }: CriticalCalloutsProps) => {
  const spotlight = records
    .filter((record) => record.severity === 'critical' || record.cvss >= 8)
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 3)

  if (!spotlight.length) return null

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningAmberIcon color="error" />
          <Typography variant="h6">Critical spotlight</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Kai ranks these findings as the most urgent after applying your filters.
        </Typography>
        <Stack spacing={2} mt={2}>
          {spotlight.map((record) => (
            <Box key={record.id}>
              <Typography variant="subtitle2" fontWeight={600}>
                {record.cve} · {record.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {record.group}/{record.repo} • CVSS {record.cvss}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, record.impactScore)}
                sx={{ mt: 1, height: 8, borderRadius: 999 }}
              />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}
