import React from 'react';
import { useProgress } from '../../hooks/useProgress.js';
import { MODULES } from '../../data/modules.js';
import ProgressBar from '../Common/ProgressBar.jsx';

export default function ModuleProgress({ moduleId }) {
  const { getModuleStepProgress, getModuleStatus, quizHistory } = useProgress();
  const module = MODULES.find(m => m.id === moduleId);
  if (!module) return null;

  const progress = getModuleStepProgress(moduleId);
  const status = getModuleStatus(moduleId);
  const quizScore = quizHistory[moduleId];

  const correct = quizScore ? quizScore.filter(q => q.correct).length : 0;
  const total = quizScore ? quizScore.length : 0;

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
    }}>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--color-text-primary)' }}>
        Module Progress
      </div>
      <ProgressBar
        value={progress}
        max={100}
        label={`${module.totalSteps} steps`}
        color={status === 'completed' ? 'var(--color-success)' : 'var(--oracle-red)'}
      />
      {quizScore && (
        <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          Quiz Score: <strong style={{ color: correct === total ? 'var(--color-success)' : 'var(--color-warning)' }}>
            {correct}/{total} correct
          </strong>
        </div>
      )}
    </div>
  );
}
