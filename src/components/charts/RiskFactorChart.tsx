import { Card, CardContent, CardHeader } from '@mui/material'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { VulnerabilityMetrics } from '../../types/vulnerability'

interface RiskFactorChartProps {
  metrics: VulnerabilityMetrics
}

export const RiskFactorChart = ({ metrics }: RiskFactorChartProps) => {
  const chartData = Object.entries(metrics.riskFactorFrequency)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Risk factors" subheader="Top drivers across tenants" />
      <CardContent sx={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 30 }}>
            <XAxis type="number" hide domain={[0, 'dataMax + 2']} />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="value" fill="#1976d2" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
