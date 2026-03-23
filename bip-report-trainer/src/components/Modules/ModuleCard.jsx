import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../Common/ProgressBar.jsx';
import Button from '../Common/Button.jsx';

const LEVEL_COLORS = {
  beginner: 'var(--level-beginner)',
  intermediate: 'var(--level-intermediate)',
  advanced: 'var(--level-advanced)',
};

export default function ModuleCard({ module, status, stepProgress }) {
  const navigate = useNavigate();

  const statusConfig = {
    'completed':    { label: '✅ Completed',   bg: 'rgba(63,185,80,0.1)',  border: 'rgba(63,185,80,0.3)',  color: 'var(--color-success)' },
    'in-progress':  { label: '⏳ In Progress', bg: 'rgba(210,153,34,0.1)', border: 'rgba(210,153,34,0.3)', color: 'var(--color-warning)' },
    'not-started':  { label: '🔒 Not Started', bg: 'transparent',           border: 'var(--color-border)',  color: 'var(--color-text-muted)' },
  }[status] || {};

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: `1px solid ${statusConfig.border}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        transition: 'all var(--transition-normal)',
        cursor: 'pointer',
        animation: 'fadeIn 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 48, height: 48,
            background: `${statusConfig.bg || 'var(--color-surface-2)'}`,
            border: `1px solid ${statusConfig.border}`,
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
          }}>
            {module.icon}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
              {module.title}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
              {module.category} · {module.estimatedTime}
            </div>
          </div>
        </div>

        {/* Level Badge */}
        <span style={{
          padding: '3px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          background: `${LEVEL_COLORS[module.level]}22`,
          color: LEVEL_COLORS[module.level],
          border: `1px solid ${LEVEL_COLORS[module.level]}44`,
          textTransform: 'capitalize',
          flexShrink: 0,
        }}>
          {module.level}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
        {module.description}
      </p>

      {/* Progress Bar */}
      <ProgressBar
        value={stepProgress}
        max={100}
        showPercent={false}
        color={stepProgress === 100 ? 'var(--color-success)' : 'var(--oracle-red)'}
        height={5}
      />

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          fontSize: 'var(--text-xs)',
          padding: '3px 10px',
          borderRadius: 'var(--radius-full)',
          background: `${statusConfig.color}18`,
          color: statusConfig.color,
          fontWeight: 600,
        }}>
          {statusConfig.label}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            +{module.xpReward} XP
          </span>
          <Button
            size="sm"
            variant={status === 'completed' ? 'ghost' : 'primary'}
            onClick={() => navigate(`/modules/${module.id}`)}
          >
            {status === 'completed' ? 'Review' : status === 'in-progress' ? 'Continue' : 'Start'}
          </Button>
        </div>
      </div>
    </div>
  );
}
