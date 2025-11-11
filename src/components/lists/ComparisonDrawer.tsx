import CloseIcon from '@mui/icons-material/Close'
import TableChartIcon from '@mui/icons-material/TableChart'
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useComparison } from '../../context/ComparisonContext'

export const ComparisonDrawer = () => {
  const { selections, remove, clear } = useComparison()
  if (!selections.length) return null

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(1100px, 90vw)',
        p: 2,
        zIndex: 1300,
        borderRadius: 3,
        backdropFilter: 'blur(6px)',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <TableChartIcon color="secondary" />
        <Typography variant="subtitle1" fontWeight={600}>
          Comparing {selections.length} findings
        </Typography>
        <Box flex={1} />
        <Chip label="Clear" size="small" onClick={clear} />
      </Stack>
      <Divider sx={{ my: 1.5 }} />
      <Box display="grid" gridTemplateColumns={`repeat(${selections.length}, minmax(0, 1fr))`} gap={2}>
        {selections.map((record) => (
          <Paper key={record.id} variant="outlined" sx={{ p: 2, position: 'relative' }}>
            <IconButton
              size="small"
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={() => remove(record.id)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography variant="subtitle2" fontWeight={700}>
              {record.cve}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {record.title}
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <Chip label={record.severity} size="small" color="primary" />
              <Chip label={`CVSS ${record.cvss}`} size="small" />
            </Stack>
            <Typography variant="body2" mt={1}>
              Kai: {(record.aiConfidence * 100).toFixed(0)}% • Manual:
              {(record.manualConfidence * 100).toFixed(0)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Repo: {record.group}/{record.repo}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Paper>
  )
}
