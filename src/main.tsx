import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App'
import { PreferencesProvider } from './context/PreferencesContext'
import { FilterProvider } from './context/FilterContext'
import { ComparisonProvider } from './context/ComparisonContext'
import { AppThemeProvider } from './components/layout/AppThemeProvider'
import { queryClient } from './state/queryClient'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <AppThemeProvider>
          <FilterProvider>
            <ComparisonProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ComparisonProvider>
          </FilterProvider>
        </AppThemeProvider>
      </PreferencesProvider>
      <ReactQueryDevtools
        initialIsOpen={false}
        position="bottom"
        buttonPosition="bottom-right"
      />
    </QueryClientProvider>
  </StrictMode>,
)
