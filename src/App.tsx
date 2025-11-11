import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { Loader } from './components/layout/Loader'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const VulnerabilityDetail = lazy(() => import('./pages/VulnerabilityDetail'))

function App() {
  return (
    <AppLayout>
      <Suspense fallback={<Loader label="Preparing dashboard" />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vulnerability/:cve" element={<VulnerabilityDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppLayout>
  )
}

export default App
