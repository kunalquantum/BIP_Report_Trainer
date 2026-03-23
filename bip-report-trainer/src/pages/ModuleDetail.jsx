import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MODULES } from '../data/modules.js';
import StepWizard from '../components/Training/StepWizard.jsx';
import ModuleProgress from '../components/Modules/ModuleProgress.jsx';
import Button from '../components/Common/Button.jsx';

export default function ModuleDetail() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  const module = MODULES.find(m => m.id === moduleId);

  if (!module) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-10)' }}>
        Module not found. <Button variant="ghost" onClick={() => navigate('/modules')}>← Back</Button>
      </div>
    );
  }

  if (completed) {
    return (
      <div style={{ textAlign: 'center', maxWidth: 480, margin: '4rem auto', animation: 'scaleIn 0.3s ease' }}>
        <div style={{ fontSize: 72, marginBottom: 'var(--space-4)' }}>🎓</div>
        <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
          Module Complete!
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
          You've completed <strong style={{ color: 'var(--color-text-primary)' }}>{module.title}</strong>
        </p>
        <p style={{ color: 'var(--oracle-red-light)', fontWeight: 700, fontSize: 'var(--text-xl)', marginBottom: 'var(--space-5)' }}>
          +{module.xpReward} XP Earned! ⚡
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <Button onClick={() => navigate('/modules')}>← All Modules</Button>
          <Button variant="ghost" onClick={() => navigate('/')}>View Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
        <button onClick={() => navigate('/modules')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}>
          Modules
        </button>
        <span>›</span>
        <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{module.title}</span>
      </div>

      {/* Module Header */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'var(--space-5)',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ fontSize: 40, width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            {module.icon}
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 4 }}>{module.title}</h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{module.description}</p>
          </div>
        </div>
        <ModuleProgress moduleId={moduleId} />
      </div>

      {/* Step Wizard */}
      <StepWizard module={module} onModuleComplete={() => setCompleted(true)} />
    </div>
  );
}
