import React from 'react';
import { getLevelByXP } from '../../data/levels.js';

export default function LevelBadge({ xp, size = 'md', showName = true }) {
  const level = getLevelByXP(xp);

  const sizes = {
    sm:  { badge: 18, fontSize: 'var(--text-xs)', pad: '3px 8px' },
    md:  { badge: 24, fontSize: 'var(--text-sm)', pad: '5px 12px' },
    lg:  { badge: 32, fontSize: 'var(--text-base)', pad: '8px 16px' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: s.pad,
      borderRadius: 'var(--radius-full)',
      background: `${level.color}18`,
      border: `1px solid ${level.color}44`,
    }}>
      <span style={{ fontSize: s.badge }}>{level.badge}</span>
      {showName && (
        <span style={{ fontSize: s.fontSize, fontWeight: 700, color: level.color }}>
          {level.name}
        </span>
      )}
    </div>
  );
}
