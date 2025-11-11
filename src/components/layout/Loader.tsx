import { Box, LinearProgress, Typography } from '@mui/material'

interface LoaderProps {
  label?: string
}

export const Loader = ({ label = 'Loading data' }: LoaderProps) => (
  <Box
    sx={{
      minHeight: 240,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
    }}
  >
    <LinearProgress sx={{ width: '60%' }} />
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Box>
)
