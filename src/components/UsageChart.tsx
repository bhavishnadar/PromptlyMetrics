import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { UsageStats } from '../services/api';
import IntercomTheme from '../theme/intercom';

interface UsageChartProps {
  data: UsageStats[];
  chartType?: 'line' | 'bar';
  title: string;
}

const UsageChart: React.FC<UsageChartProps> = ({ 
  data, 
  chartType = 'line', 
  title 
}) => {
  const chartData = data.reduce((acc, item) => {
    const existingDate = acc.find(d => d.date === item.date);
    // Normalize endpoint names for consistent chart keys
    const normalizedEndpoint = item.endpoint === '/score-prompt' ? '/score' : item.endpoint;
    
    if (existingDate) {
      existingDate[`${normalizedEndpoint}_requests`] = item.total_requests;
      existingDate[`${normalizedEndpoint}_response_time`] = Math.round(item.avg_response_time);
    } else {
      acc.push({
        date: item.date,
        [`${normalizedEndpoint}_requests`]: item.total_requests,
        [`${normalizedEndpoint}_response_time`]: Math.round(item.avg_response_time)
      });
    }
    return acc;
  }, [] as any[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{
      backgroundColor: IntercomTheme.colors.backgroundSecondary,
      padding: IntercomTheme.spacing.lg,
      borderRadius: IntercomTheme.borderRadius.lg,
      boxShadow: IntercomTheme.shadows.base,
      border: `1px solid ${IntercomTheme.colors.border}`,
      minHeight: '400px',
      fontFamily: IntercomTheme.typography.fontFamily
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: IntercomTheme.spacing.lg
      }}>
        <h3 style={{
          margin: 0,
          fontSize: IntercomTheme.typography.fontSizes.lg,
          fontWeight: IntercomTheme.typography.fontWeights.semibold,
          color: IntercomTheme.colors.textPrimary
        }}>
          {title}
        </h3>
        
        {/* Custom Legend */}
        <div style={{ display: 'flex', gap: IntercomTheme.spacing.lg, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '3px',
              backgroundColor: IntercomTheme.colors.chart.blue,
              borderRadius: '2px'
            }} />
            <span style={{
              fontSize: IntercomTheme.typography.fontSizes.sm,
              color: IntercomTheme.colors.textSecondary,
              fontWeight: IntercomTheme.typography.fontWeights.medium
            }}>
              Score API
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '3px',
              backgroundColor: IntercomTheme.colors.chart.teal,
              borderRadius: '2px'
            }} />
            <span style={{
              fontSize: IntercomTheme.typography.fontSizes.sm,
              color: IntercomTheme.colors.textSecondary,
              fontWeight: IntercomTheme.typography.fontWeights.medium
            }}>
              Improve API
            </span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        {chartType === 'line' ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip 
              labelFormatter={formatDate}
              formatter={(value: any, name: string) => [
                value,
                name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="/score_requests" 
              stroke={IntercomTheme.colors.chart.blue} 
              strokeWidth={3}
              name="Score API Requests"
              dot={{ fill: IntercomTheme.colors.chart.blue, strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="/improve_requests" 
              stroke={IntercomTheme.colors.chart.teal} 
              strokeWidth={3}
              name="Improve API Requests"
              dot={{ fill: IntercomTheme.colors.chart.teal, strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip 
              labelFormatter={formatDate}
              formatter={(value: any, name: string) => [
                `${value}ms`,
                name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
              ]}
            />
            <Legend />
            <Bar 
              dataKey="/score_response_time" 
              fill={IntercomTheme.colors.chart.blue}
              name="Score Response Time"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="/improve_response_time" 
              fill={IntercomTheme.colors.chart.teal}
              name="Improve Response Time"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;