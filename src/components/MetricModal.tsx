import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { UsageStats } from '../services/api';

export type MetricType = 'totalRequests' | 'successRate' | 'avgResponseTime' | 'scoreRequests' | 'improveRequests' | 'failedRequests' | 'avgImprovement' | 'maxImprovement';

interface MetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricType: MetricType;
  data: UsageStats[];
  title: string;
}

const MetricModal: React.FC<MetricModalProps> = ({ isOpen, onClose, metricType, data, title }) => {
  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const prepareChartData = () => {
    const chartData = data.reduce((acc, item) => {
      const existingDate = acc.find(d => d.date === item.date);
      if (existingDate) {
        existingDate.totalRequests += item.total_requests;
        existingDate.successfulRequests += item.successful_requests;
        existingDate.failedRequests += item.failed_requests;
        existingDate.avgResponseTime = Math.round((existingDate.avgResponseTime + item.avg_response_time) / 2);
        
        if (item.endpoint === '/score-prompt') {
          existingDate.scoreRequests = item.total_requests;
        } else if (item.endpoint === '/improve') {
          existingDate.improveRequests = item.total_requests;
          // Add improvement metrics from the /improve endpoint data
          existingDate.avgImprovement = item.avg_score_improvement || 0;
          existingDate.maxImprovement = item.avg_score_improvement || 0; // Use avg for now, max not in daily data
        }
      } else {
        acc.push({
          date: item.date,
          totalRequests: item.total_requests,
          successfulRequests: item.successful_requests,
          failedRequests: item.failed_requests,
          avgResponseTime: Math.round(item.avg_response_time),
          scoreRequests: item.endpoint === '/score-prompt' ? item.total_requests : 0,
          improveRequests: item.endpoint === '/improve' ? item.total_requests : 0,
          avgImprovement: item.endpoint === '/improve' ? (item.avg_score_improvement || 0) : 0,
          maxImprovement: item.endpoint === '/improve' ? (item.avg_score_improvement || 0) : 0 // Use avg for now, max not in daily data
        });
      }
      return acc;
    }, [] as any[]);

    // Calculate success rate for each day
    return chartData.map(item => ({
      ...item,
      successRate: item.totalRequests > 0 
        ? Math.round((item.successfulRequests / item.totalRequests) * 100) 
        : 0
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const chartData = prepareChartData();

  const getChartConfig = () => {
    switch (metricType) {
      case 'totalRequests':
        return {
          dataKey: 'totalRequests',
          color: '#4f46e5',
          chartType: 'area',
          yAxisLabel: 'Requests',
          formatValue: (value: number) => value.toLocaleString()
        };
      case 'successRate':
        return {
          dataKey: 'successRate',
          color: '#10b981',
          chartType: 'line',
          yAxisLabel: 'Success Rate (%)',
          formatValue: (value: number) => `${value}%`
        };
      case 'avgResponseTime':
        return {
          dataKey: 'avgResponseTime',
          color: '#f59e0b',
          chartType: 'line',
          yAxisLabel: 'Response Time (ms)',
          formatValue: (value: number) => `${value}ms`
        };
      case 'scoreRequests':
        return {
          dataKey: 'scoreRequests',
          color: '#8b5cf6',
          chartType: 'bar',
          yAxisLabel: 'Score Requests',
          formatValue: (value: number) => value.toLocaleString()
        };
      case 'improveRequests':
        return {
          dataKey: 'improveRequests',
          color: '#06b6d4',
          chartType: 'bar',
          yAxisLabel: 'Improve Requests',
          formatValue: (value: number) => value.toLocaleString()
        };
      case 'failedRequests':
        return {
          dataKey: 'failedRequests',
          color: '#ef4444',
          chartType: 'area',
          yAxisLabel: 'Failed Requests',
          formatValue: (value: number) => value.toLocaleString()
        };
      case 'avgImprovement':
        return {
          dataKey: 'avgImprovement',
          color: '#10b981',
          chartType: 'line',
          yAxisLabel: 'Average Score Improvement',
          formatValue: (value: number) => `+${value.toFixed(1)}`
        };
      case 'maxImprovement':
        return {
          dataKey: 'maxImprovement',
          color: '#f59e0b',
          chartType: 'bar',
          yAxisLabel: 'Maximum Score Improvement',
          formatValue: (value: number) => `+${value.toFixed(1)}`
        };
      default:
        return {
          dataKey: 'totalRequests',
          color: '#4f46e5',
          chartType: 'line',
          yAxisLabel: 'Value',
          formatValue: (value: number) => value.toString()
        };
    }
  };

  const config = getChartConfig();

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    const commonElements = (
      <>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate}
          fontSize={12}
        />
        <YAxis 
          fontSize={12}
          label={{ 
            value: config.yAxisLabel, 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }}
        />
        <Tooltip 
          labelFormatter={formatDate}
          formatter={(value: any) => [config.formatValue(Number(value)), title]}
        />
      </>
    );

    switch (config.chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {commonElements}
            <Area 
              type="monotone" 
              dataKey={config.dataKey} 
              stroke={config.color}
              fill={config.color}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {commonElements}
            <Bar dataKey={config.dataKey} fill={config.color} />
          </BarChart>
        );
      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            {commonElements}
            <Line 
              type="monotone" 
              dataKey={config.dataKey} 
              stroke={config.color}
              strokeWidth={3}
              dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '800px',
        height: '70vh',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '16px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
            {title} Over Time
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '8px',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>

        {/* Chart */}
        <div style={{ height: 'calc(100% - 80px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Footer with stats */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '24px',
          right: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#6b7280',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '12px'
        }}>
          <span>{chartData.length} data points</span>
          <span>
            {chartData.length > 0 && (
              <>
                {formatDate(chartData[0].date)} - {formatDate(chartData[chartData.length - 1].date)}
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetricModal;