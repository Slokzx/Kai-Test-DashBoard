import { Box, Container } from '@mui/material'
import type { PropsWithChildren } from 'react'
import { TopBar } from './TopBar'

export const AppLayout = ({ children }: PropsWithChildren) => (
  <Box minHeight="100vh" display="flex" flexDirection="column">
    <TopBar />
    <Container maxWidth="xl" sx={{ py: 3, flex: 1, width: '100%' }}>
      {children}
    </Container>
  </Box>
)
