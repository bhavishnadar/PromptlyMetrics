import React, { useState, useEffect } from 'react';
import { apiService, MetricsResponse, UsageStats, DetailedMetricsResponse, DashboardDataResponse } from './services/api';
import MetricCard from './components/MetricCard';
import UsageChart from './components/UsageChart';
import MetricModal, { MetricType } from './components/MetricModal';
import PromptSearch from './components/PromptSearch';
import IntercomTheme from './theme/intercom';

const App: React.FC = () => {
  const [metricsData, setMetricsData] = useState<MetricsResponse | null>(null);
  const [detailedMetrics, setDetailedMetrics] = useState<DetailedMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState(30);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    metricType: MetricType | null;
    title: string;
  }>({
    isOpen: false,
    metricType: null,
    title: ''
  });

  const fetchMetrics = async (days: number) => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await apiService.getDashboardData(days);
      setMetricsData(dashboardData.usage_stats);
      setDetailedMetrics(dashboardData.detailed_metrics);
    } catch (err) {
      setError('Failed to fetch metrics data. Make sure the backend server is running.');
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics(selectedDays);
  }, [selectedDays]);

  const metrics = detailedMetrics?.metrics;
  const successRate = metrics && metrics.total_requests > 0 
    ? ((metrics.successful_requests / metrics.total_requests) * 100).toFixed(1)
    : '0';
  const improvementRate = metrics && metrics.total_improvements > 0 
    ? ((metrics.successful_improvements / metrics.total_improvements) * 100).toFixed(1)
    : '0';

  const openMetricModal = (metricType: MetricType, title: string) => {
    setModalState({
      isOpen: true,
      metricType,
      title
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      metricType: null,
      title: ''
    });
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: IntercomTheme.colors.background,
        fontFamily: IntercomTheme.typography.fontFamily
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: `4px solid ${IntercomTheme.colors.border}`,
            borderTop: `4px solid ${IntercomTheme.colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: `${IntercomTheme.spacing.lg} auto ${IntercomTheme.spacing.md}`
          }} />
          <p style={{ 
            color: IntercomTheme.colors.textSecondary, 
            margin: 0,
            fontSize: IntercomTheme.typography.fontSizes.base,
            fontWeight: IntercomTheme.typography.fontWeights.medium
          }}>
            Loading metrics...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: IntercomTheme.colors.background,
        fontFamily: IntercomTheme.typography.fontFamily,
        padding: IntercomTheme.spacing.lg
      }}>
        <div style={{
          backgroundColor: IntercomTheme.colors.backgroundSecondary,
          padding: IntercomTheme.spacing['2xl'],
          borderRadius: IntercomTheme.borderRadius.xl,
          boxShadow: IntercomTheme.shadows.lg,
          border: `1px solid ${IntercomTheme.colors.error}`,
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            color: IntercomTheme.colors.error, 
            margin: `0 0 ${IntercomTheme.spacing.md} 0`,
            fontSize: IntercomTheme.typography.fontSizes['2xl'],
            fontWeight: IntercomTheme.typography.fontWeights.bold
          }}>
            Connection Error
          </h2>
          <p style={{ 
            color: IntercomTheme.colors.textSecondary, 
            margin: `0 0 ${IntercomTheme.spacing.lg} 0`,
            fontSize: IntercomTheme.typography.fontSizes.base,
            lineHeight: '1.5'
          }}>
            {error}
          </p>
          <button
            onClick={() => fetchMetrics(selectedDays)}
            style={{
              backgroundColor: IntercomTheme.colors.primary,
              color: IntercomTheme.colors.textInverse,
              border: 'none',
              padding: `${IntercomTheme.spacing.md} ${IntercomTheme.spacing.lg}`,
              borderRadius: IntercomTheme.borderRadius.md,
              cursor: 'pointer',
              fontSize: IntercomTheme.typography.fontSizes.base,
              fontWeight: IntercomTheme.typography.fontWeights.medium,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = IntercomTheme.colors.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = IntercomTheme.colors.primary;
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: IntercomTheme.colors.background,
      fontFamily: IntercomTheme.typography.fontFamily
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          body {
            margin: 0;
            font-family: ${IntercomTheme.typography.fontFamily};
            background-color: ${IntercomTheme.colors.background};
          }
        `}
      </style>
      
      {/* Header */}
      <div style={{
        backgroundColor: IntercomTheme.colors.backgroundSecondary,
        borderBottom: `1px solid ${IntercomTheme.colors.border}`,
        padding: `${IntercomTheme.spacing.lg} 0`,
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          padding: `0 ${IntercomTheme.spacing.lg}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: IntercomTheme.spacing.lg }}>
            <h1 style={{
              margin: 0,
              fontSize: IntercomTheme.typography.fontSizes['2xl'],
              fontWeight: IntercomTheme.typography.fontWeights.bold,
              color: IntercomTheme.colors.textPrimary
            }}>
              Promptly Analytics Dashboard
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: IntercomTheme.spacing.md, alignItems: 'center' }}>
            <label style={{ 
              fontSize: IntercomTheme.typography.fontSizes.sm,
              color: IntercomTheme.colors.textSecondary,
              fontWeight: IntercomTheme.typography.fontWeights.medium
            }}>
              Time Period:
            </label>
            <select
            
              value={selectedDays}
              onChange={(e) => setSelectedDays(Number(e.target.value))}
              style={{
                padding: `${IntercomTheme.spacing.sm} ${IntercomTheme.spacing.md}`,
                borderRadius: IntercomTheme.borderRadius.md,
                border: `1px solid ${IntercomTheme.colors.border}`,
                backgroundColor: IntercomTheme.colors.backgroundSecondary,
                fontSize: IntercomTheme.typography.fontSizes.sm,
                fontWeight: IntercomTheme.typography.fontWeights.medium,
                color: IntercomTheme.colors.textPrimary,
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = IntercomTheme.colors.primary}
              onBlur={(e) => e.currentTarget.style.borderColor = IntercomTheme.colors.border}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        padding: IntercomTheme.spacing['2xl']
      }}>
        {metrics && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: IntercomTheme.spacing.lg,
            marginBottom: IntercomTheme.spacing['2xl']
          }}>
            <MetricCard 
              title="Total Requests" 
              value={metrics.total_requests.toLocaleString()} 
              subtitle={`Last ${selectedDays} days`}
              color={IntercomTheme.colors.chart.blue}
              onClick={() => openMetricModal('totalRequests', 'Total Requests')}
            />
            <MetricCard 
              title="Score Requests" 
              value={metrics.score_requests.toLocaleString()}
              subtitle="Prompts scored"
              color={IntercomTheme.colors.chart.purple}
              onClick={() => openMetricModal('scoreRequests', 'Score Requests')}
            />
            <MetricCard 
              title="Improve Requests" 
              value={metrics.improve_requests.toLocaleString()}
              subtitle="Prompts improved"
              color={IntercomTheme.colors.chart.teal}
              onClick={() => openMetricModal('improveRequests', 'Improve Requests')}
            />
            <MetricCard 
              title="Avg Score Improvement" 
              value={metrics.avg_improvement ? `+${metrics.avg_improvement.toFixed(1)}` : 'N/A'}
              subtitle={`${metrics.successful_improvements} successful improvements`}
              color={IntercomTheme.colors.chart.green}
              onClick={() => openMetricModal('avgImprovement', 'Average Score Improvement')}
            />
            <MetricCard 
              title="Max Improvement" 
              value={metrics.max_improvement ? `+${metrics.max_improvement.toFixed(1)}` : 'N/A'}
              subtitle="Best single improvement"
              color={IntercomTheme.colors.chart.yellow}
              onClick={() => openMetricModal('maxImprovement', 'Maximum Improvement')}
            />
          </div>
        )}

        {metricsData && metricsData.stats.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: IntercomTheme.spacing.lg,
            marginBottom: IntercomTheme.spacing['2xl']
          }}>
            <UsageChart 
              data={metricsData.stats}
              chartType="line"
              title="Daily Request Volume"
            />
          </div>
        )}

        {/* High-Quality Prompts Search */}
        <PromptSearch />

        {metricsData && metricsData.stats.length === 0 && (
          <div style={{
            backgroundColor: IntercomTheme.colors.backgroundSecondary,
            padding: IntercomTheme.spacing['3xl'],
            borderRadius: IntercomTheme.borderRadius.lg,
            boxShadow: IntercomTheme.shadows.base,
            border: `1px solid ${IntercomTheme.colors.border}`,
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: IntercomTheme.colors.textSecondary, 
              margin: `0 0 ${IntercomTheme.spacing.md} 0`,
              fontSize: IntercomTheme.typography.fontSizes.lg,
              fontWeight: IntercomTheme.typography.fontWeights.semibold
            }}>
              No Data Available
            </h3>
            <p style={{ 
              color: IntercomTheme.colors.textTertiary, 
              margin: 0,
              fontSize: IntercomTheme.typography.fontSizes.base,
              lineHeight: '1.5'
            }}>
              No usage data found for the selected time period. 
              Try making some API requests to the backend first.
            </p>
          </div>
        )}

        {/* Metric Detail Modal */}
        {modalState.metricType && metricsData && (
          <MetricModal
            isOpen={modalState.isOpen}
            onClose={closeModal}
            metricType={modalState.metricType}
            data={metricsData.stats}
            title={modalState.title}
          />
        )}
      </div>
    </div>
  );
};

export default App;