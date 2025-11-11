import { Card, CardContent, CardHeader } from '@mui/material'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { VulnerabilityMetrics } from '../../types/vulnerability'

interface TrendChartProps {
  metrics: VulnerabilityMetrics
}

export const TrendChart = ({ metrics }: TrendChartProps) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader title="Trend analysis" subheader="Monthly discovery cadence" />
    <CardContent sx={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={metrics.trend}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1976d2" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#1976d2"
            fillOpacity={1}
            fill="url(#trendGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)
