import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { usePreferences } from '../../context/PreferencesContext'

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const {
    preferences: { themeMode, highlightCritical },
  } = usePreferences()

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#009688',
          },
          background: {
            default: themeMode === 'dark' ? '#0b0f19' : '#f5f7fb',
            paper: themeMode === 'dark' ? '#141a2a' : '#ffffff',
          },
        },
        shape: { borderRadius: 14 },
        typography: {
          fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
          h1: { fontSize: '2.4rem', fontWeight: 600 },
          h2: { fontSize: '1.8rem', fontWeight: 600 },
          h3: { fontSize: '1.4rem', fontWeight: 600 },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                borderRadius: 16,
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 600,
              },
              colorError: highlightCritical
                ? {
                    backgroundColor: '#ff5252',
                    color: '#fff',
                  }
                : undefined,
            },
          },
        },
      }),
    [themeMode, highlightCritical],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
