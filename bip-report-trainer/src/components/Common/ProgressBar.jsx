import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label = null,
  showPercent = true,
  color = 'var(--oracle-red)',
  height = 8,
  animated = true,
  style = {},
}) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div style={{ width: '100%', ...style }}>
      {(label || showPercent) && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 6,
        }}>
          {label && (
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              {label}
            </span>
          )}
          {showPercent && (
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginLeft: 'auto' }}>
              {pct}%
            </span>
          )}
        </div>
      )}

      <div style={{
        width: '100%',
        height,
        background: 'var(--color-surface-3)',
        borderRadius: 9999,
        overflow: 'hidden',
      }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: 9999,
            transition: animated ? 'width 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none',
            backgroundImage: animated && pct > 0
              ? `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 70%, white))`
              : undefined,
          }}
        />
      </div>
    </div>
  );
}
