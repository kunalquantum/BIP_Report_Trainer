import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, Legend,
} from 'recharts';
import { useProgress } from '../../hooks/useProgress.js';
import { MODULES } from '../../data/modules.js';

const WEEK_DATA = [
  { day: 'Mon', xp: 0 },
  { day: 'Tue', xp: 0 },
  { day: 'Wed', xp: 0 },
  { day: 'Thu', xp: 0 },
  { day: 'Fri', xp: 0 },
  { day: 'Sat', xp: 0 },
  { day: 'Sun', xp: 0 },
];

export default function ProgressChart() {
  const { totalXP, stats, moduleProgress, completedModules } = useProgress();

  // Radial bar data per module
  const radialData = MODULES.map(m => {
    const prog = moduleProgress[m.id];
    const pct = completedModules.includes(m.id)
      ? 100
      : prog ? Math.round((prog.completedSteps.length / m.totalSteps) * 100) : 0;
    return { name: m.title.split(' ')[0], value: pct, fill: completedModules.includes(m.id) ? '#3fb950' : '#c74634' };
  });

  // Simulated XP area chart based on totalXP
  const areaData = WEEK_DATA.map((d, i) => ({
    ...d,
    xp: i === 6 ? totalXP : Math.max(0, totalXP - (6 - i) * Math.floor(totalXP / 7)),
  }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
      {/* XP Over Time */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
      }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
          XP This Week
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={areaData}>
            <defs>
              <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c74634" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#c74634" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="day" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text-primary)' }}
            />
            <Area type="monotone" dataKey="xp" stroke="#c74634" fill="url(#xpGrad)" strokeWidth={2} dot={{ fill: '#c74634', r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Module Completion Radial */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
      }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
          Module Completion
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={radialData} startAngle={180} endAngle={0}>
            <RadialBar dataKey="value" cornerRadius={4} />
            <Legend iconSize={8} formatter={(value, entry) => (
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{entry.payload.name}</span>
            )} />
            <Tooltip
              contentStyle={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 8 }}
              formatter={(val) => [`${val}%`, 'Progress']}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
