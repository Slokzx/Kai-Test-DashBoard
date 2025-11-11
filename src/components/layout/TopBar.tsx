import MenuIcon from '@mui/icons-material/Menu'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import NightlightRoundIcon from '@mui/icons-material/NightlightRound'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useState } from 'react'
import { usePreferences } from '../../context/PreferencesContext'
import { PreferencesDrawer } from '../preferences/PreferencesDrawer'

export const TopBar = () => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))
  const {
    preferences: { themeMode },
    updatePreferences,
  } = usePreferences()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleTheme = () =>
    updatePreferences({ themeMode: themeMode === 'light' ? 'dark' : 'light' })

  return (
    <>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton color="inherit" edge="start">
            <MenuIcon />
          </IconButton>
          <Box flex={1}>
            <Typography variant={matches ? 'h5' : 'h6'} fontWeight={600}>
              Kai Security Workbench
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <MyLocationIcon fontSize="inherit" /> Unified risk intelligence dashboard
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
            {themeMode === 'light' ? <NightlightRoundIcon /> : <WbSunnyIcon />}
          </IconButton>
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <PreferencesDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
