import { Card, CardContent, CardHeader } from '@mui/material'
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { VulnerabilityRecord } from '../../types/vulnerability'

interface AiManualChartProps {
  records: VulnerabilityRecord[]
}

const colors = {
  confirmed: '#42a5f5',
  'needs-review': '#ffa726',
  'invalid - norisk': '#9e9e9e',
  'ai-invalid-norisk': '#ab47bc',
  unpatched: '#ef5350',
  investigating: '#8d6e63',
  'needs triage': '#26a69a',
}

export const AiManualChart = ({ records }: AiManualChartProps) => {
  const grouped: Record<string, { ai: number; manual: number }[]> = {}
  records.forEach((record) => {
    const key = record.kaiStatus
    if (!grouped[key]) grouped[key] = []
    grouped[key].push({ ai: record.aiConfidence * 100, manual: record.manualConfidence * 100 })
  })

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="AI vs manual analysis"
        subheader="Understanding agreement between Kai and analysts"
      />
      <CardContent sx={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ left: 10, bottom: 10 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="ai" name="AI" unit="%" domain={[0, 100]} />
            <YAxis type="number" dataKey="manual" name="Manual" unit="%" domain={[0, 100]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            {Object.entries(grouped).map(([status, data]) => (
              <Scatter
                key={status}
                name={status}
                data={data}
                fill={colors[status as keyof typeof colors] ?? '#607d8b'}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
