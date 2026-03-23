import React from 'react';
import { LEADERBOARD_MOCK } from '../../data/levels.js';
import { useProgress } from '../../hooks/useProgress.js';
import LevelBadge from '../Training/LevelBadge.jsx';

export default function LeaderBoard() {
  const { totalXP } = useProgress();

  // Inject real user XP
  const board = LEADERBOARD_MOCK.map(u => u.isCurrentUser ? { ...u, xp: totalXP } : u)
    .sort((a, b) => b.xp - a.xp);

  const medalColors = ['#e3b341', '#8b949e', '#c56f3c'];

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: 'var(--space-4) var(--space-5)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
          🏆 Leaderboard
        </span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>by XP</span>
      </div>

      <div>
        {board.map((user, rank) => {
          const isCurrent = user.isCurrentUser;
          return (
            <div key={user.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-5)',
              borderBottom: '1px solid var(--color-border-soft)',
              background: isCurrent ? 'var(--oracle-red-glow)' : 'transparent',
              transition: 'background 150ms ease',
            }}>
              {/* Rank */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: rank < 3 ? `${medalColors[rank]}22` : 'var(--color-surface-2)',
                border: rank < 3 ? `1px solid ${medalColors[rank]}66` : '1px solid var(--color-border)',
                fontSize: rank < 3 ? 14 : 'var(--text-xs)',
                fontWeight: 700,
                color: rank < 3 ? medalColors[rank] : 'var(--color-text-muted)',
                flexShrink: 0,
              }}>
                {rank < 3 ? ['🥇','🥈','🥉'][rank] : rank + 1}
              </div>

              {/* Avatar */}
              <div style={{ fontSize: 22, flexShrink: 0 }}>{user.avatar}</div>

              {/* Name */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? 'var(--oracle-red-light)' : 'var(--color-text-primary)',
                }}>
                  {user.name} {isCurrent && <span style={{ fontSize: 10 }}>(You)</span>}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {user.completedModules} modules · {user.xp} XP
                </div>
              </div>

              {/* Level Badge */}
              <LevelBadge xp={user.xp} size="sm" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
