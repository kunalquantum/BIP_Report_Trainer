import React, { useState } from 'react';
import { SCENARIOS } from '../../data/scenarios.js';
import { useProgress } from '../../hooks/useProgress.js';
import { useScenario } from '../../hooks/useScenario.js';
import Button from '../Common/Button.jsx';
import ProgressBar from '../Common/ProgressBar.jsx';

export default function ScenarioPlayer() {
  const [activeScenarioId, setActiveScenarioId] = useState(null);

  if (activeScenarioId) {
    return <ActiveScenario scenarioId={activeScenarioId} onBack={() => setActiveScenarioId(null)} />;
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 4 }}>
          Training Scenarios
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          Hands-on BIP practice challenges — follow guided steps and earn XP.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 'var(--space-5)',
      }}>
        {SCENARIOS.map(sc => (
          <div key={sc.id} style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            transition: 'all var(--transition-normal)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                  {sc.title}
                </h3>
                <span style={{
                  fontSize: 'var(--text-xs)', fontWeight: 600,
                  padding: '2px 8px', borderRadius: 'var(--radius-full)',
                  background: sc.difficulty === 'advanced' ? 'rgba(199,70,52,0.15)' : 'rgba(210,153,34,0.15)',
                  color: sc.difficulty === 'advanced' ? 'var(--oracle-red-light)' : 'var(--color-warning)',
                  textTransform: 'capitalize',
                }}>
                  {sc.difficulty}
                </span>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{sc.estimatedTime}</span>
            </div>

            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {sc.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                {sc.steps.length} steps · +{sc.xpReward} XP
              </span>
              <Button size="sm" onClick={() => setActiveScenarioId(sc.id)}>
                Start Scenario →
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActiveScenario({ scenarioId, onBack }) {
  const { scenario, currentStep, currentStepData, totalSteps, isLastStep, isCompleted, stepValidated, validateStep, nextStep } = useScenario(scenarioId);

  if (!scenario) return <div>Scenario not found.</div>;

  if (isCompleted) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-10)', animation: 'scaleIn 0.3s ease' }}>
        <div style={{ fontSize: 72, marginBottom: 'var(--space-4)' }}>🏆</div>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
          Scenario Complete!
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)' }}>
          You earned <strong style={{ color: 'var(--oracle-red-light)' }}>+{scenario.xpReward} XP</strong>
        </p>
        <Button onClick={onBack}>← Back to Scenarios</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <button onClick={onBack} style={{
          background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)', padding: '6px 12px',
          color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: 'var(--text-sm)',
        }}>← Back</button>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Step {currentStep + 1} of {totalSteps}</div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{scenario.title}</div>
        </div>
      </div>

      <ProgressBar value={currentStep} max={totalSteps} showPercent={false} height={4} style={{ marginBottom: 'var(--space-5)' }} />

      {/* Step Card */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-5)',
      }}>
        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', lineHeight: 1.4 }}>
          📌 {currentStepData?.instruction}
        </div>

        {currentStepData?.hint && (
          <div style={{
            padding: 'var(--space-3)',
            background: 'rgba(88,166,255,0.06)',
            border: '1px solid rgba(88,166,255,0.2)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-4)',
          }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-info)' }}>💡 Hint: </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{currentStepData.hint}</span>
          </div>
        )}

        {currentStepData?.codeSnippet && (
          <pre style={{
            background: 'var(--color-surface-3)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-info)',
            overflowX: 'auto',
            marginBottom: 'var(--space-4)',
            lineHeight: 1.7,
          }}>
            {currentStepData.codeSnippet}
          </pre>
        )}

        {currentStepData?.validation && (
          <div style={{
            padding: 'var(--space-3)',
            background: 'rgba(63,185,80,0.06)',
            border: '1px solid rgba(63,185,80,0.2)',
            borderRadius: 'var(--radius-md)',
          }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-success)' }}>✅ Expected Result: </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{currentStepData.validation}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {!stepValidated ? (
          <Button variant="secondary" onClick={validateStep}>Mark as Done ✓</Button>
        ) : (
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-success)' }}>✅ Step validated</span>
        )}
        <Button onClick={nextStep} disabled={!stepValidated}>
          {isLastStep ? 'Complete Scenario 🏆' : 'Next Step →'}
        </Button>
      </div>
    </div>
  );
}
