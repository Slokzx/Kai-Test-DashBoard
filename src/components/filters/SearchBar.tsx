import SearchIcon from '@mui/icons-material/Search'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import { Chip, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  suggestions: string[]
  placeholder?: string
}

export const SearchBar = ({
  value,
  onChange,
  suggestions,
  placeholder = 'Search by CVE, package, component, or tag',
}: SearchBarProps) => (
  <Stack spacing={1.5}>
    <TextField
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
    {suggestions.length > 0 && (
      <Paper
        variant="outlined"
        sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}
      >
        <TipsAndUpdatesIcon fontSize="small" color="primary" />
        <Typography variant="caption" color="text.secondary">
          Live suggestions
        </Typography>
        {suggestions.map((suggestion) => (
          <Chip
            key={suggestion}
            size="small"
            label={suggestion}
            onClick={() => onChange(suggestion)}
          />
        ))}
      </Paper>
    )}
  </Stack>
)
