import React from 'react';
import IntercomTheme from '../theme/intercom';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  color = IntercomTheme.colors.primary,
  onClick
}) => {
  return (
    <div 
      style={{
        backgroundColor: IntercomTheme.colors.backgroundSecondary,
        padding: IntercomTheme.spacing.lg,
        borderRadius: IntercomTheme.borderRadius.lg,
        boxShadow: IntercomTheme.shadows.base,
        border: `1px solid ${IntercomTheme.colors.border}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateY(0px)',
        fontFamily: IntercomTheme.typography.fontFamily,
        textAlign: 'center'
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = IntercomTheme.shadows.lg;
          e.currentTarget.style.borderColor = IntercomTheme.colors.borderActive;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = IntercomTheme.shadows.base;
          e.currentTarget.style.borderColor = IntercomTheme.colors.border;
        }
      }}
    >
      <h3 style={{
        margin: `0 0 ${IntercomTheme.spacing.sm} 0`,
        fontSize: IntercomTheme.typography.fontSizes.sm,
        fontWeight: IntercomTheme.typography.fontWeights.medium,
        color: IntercomTheme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        textAlign: 'center'
      }}>
        {title}
      </h3>
      <div style={{
        fontSize: IntercomTheme.typography.fontSizes['3xl'],
        fontWeight: IntercomTheme.typography.fontWeights.bold,
        color: color,
        margin: `0 0 ${IntercomTheme.spacing.xs} 0`,
        lineHeight: '1.2',
        textAlign: 'center'
      }}>
        {value}
      </div>
      {subtitle && (
        <p style={{
          margin: 0,
          fontSize: IntercomTheme.typography.fontSizes.xs,
          color: IntercomTheme.colors.textTertiary,
          fontWeight: IntercomTheme.typography.fontWeights.normal,
          textAlign: 'center'
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default MetricCard;