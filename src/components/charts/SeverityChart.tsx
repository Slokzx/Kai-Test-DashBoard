import { Card, CardContent, CardHeader } from '@mui/material'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Severity, VulnerabilityMetrics } from '../../types/vulnerability'

const COLORS: Record<Severity, string> = {
  critical: '#ff1744',
  high: '#ff9100',
  medium: '#29b6f6',
  low: '#9ccc65',
}

interface SeverityChartProps {
  metrics: VulnerabilityMetrics
}

export const SeverityChart = ({ metrics }: SeverityChartProps) => {
  const chartData = (Object.keys(metrics.severityDistribution) as Severity[]).map(
    (severity) => ({
      name: severity,
      value: metrics.severityDistribution[severity],
    }),
  )

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Severity distribution" subheader="Live Kai intelligence" />
      <CardContent sx={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name as Severity]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
