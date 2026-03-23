import React, { useState } from 'react';
import { MODULES, MODULE_CATEGORIES } from '../../data/modules.js';
import { useProgress } from '../../hooks/useProgress.js';
import ModuleCard from './ModuleCard.jsx';

export default function ModuleList() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { getModuleStatus, getModuleStepProgress } = useProgress();

  const filtered = activeCategory === 'All'
    ? MODULES
    : MODULES.filter(m => m.category === activeCategory);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
        {MODULE_CATEGORIES.map(cat => {
          const active = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                border: active ? '1px solid var(--oracle-red)' : '1px solid var(--color-border)',
                background: active ? 'var(--oracle-red-glow)' : 'var(--color-surface)',
                color: active ? 'var(--oracle-red-light)' : 'var(--color-text-secondary)',
                fontWeight: active ? 600 : 400,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 'var(--space-5)',
      }}>
        {filtered.map(module => (
          <ModuleCard
            key={module.id}
            module={module}
            status={getModuleStatus(module.id)}
            stepProgress={getModuleStepProgress(module.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-12)' }}>
          No modules found for this category.
        </div>
      )}
    </div>
  );
}
