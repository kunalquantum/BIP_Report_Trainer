import React from 'react';
import { useProgress } from '../../hooks/useProgress.js';
import QuizEngine from './QuizEngine.jsx';
import Button from '../Common/Button.jsx';
import ProgressBar from '../Common/ProgressBar.jsx';

export default function StepWizard({ module, onModuleComplete }) {
  const { getCurrentStep, advanceStep, completeModule, getModuleStepProgress, startModule } = useProgress();

  // Ensure module is started
  React.useEffect(() => { startModule(module.id); }, [module.id]);

  const currentStepIndex = getCurrentStep(module.id);
  const step = module.steps[currentStepIndex];
  const stepProgress = getModuleStepProgress(module.id);
  const isLastStep = currentStepIndex >= module.steps.length - 1;

  function handleNext() {
    advanceStep(module.id, currentStepIndex);
    if (isLastStep) {
      completeModule(module.id);
      onModuleComplete?.();
    }
  }

  if (!step) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
        <div style={{ fontSize: 64, marginBottom: 'var(--space-4)' }}>🎓</div>
        <h2 style={{ fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
          Module Complete!
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          You've finished all steps. Check your Dashboard for updated progress.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Step {currentStepIndex + 1} of {module.steps.length}
            </div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: 2 }}>
              {step.title}
            </h2>
          </div>
          <span style={{
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
            textTransform: 'capitalize',
          }}>
            {step.type}
          </span>
        </div>
        <ProgressBar value={stepProgress} showPercent={false} height={4} />
      </div>

      {/* Step Content */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-5)',
        minHeight: 200,
      }}>
        {step.type === 'quiz' ? (
          <QuizEngine
            questions={step.questions}
            moduleId={module.id}
            onComplete={handleNext}
          />
        ) : step.type === 'summary' ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <div style={{ fontSize: 48, marginBottom: 'var(--space-4)' }}>✅</div>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)', fontWeight: 500, marginBottom: 'var(--space-5)' }}>
              {step.content}
            </p>
            <Button onClick={handleNext} size="lg" icon="🎓">
              Complete Module (+{module.xpReward} XP)
            </Button>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-5)' }}>
              {step.content}
            </p>
            {step.keyPoints && (
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
                  Key Points:
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {step.keyPoints.map((pt, i) => (
                    <li key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-3)',
                      background: 'var(--color-surface-2)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                    }}>
                      <span style={{ color: 'var(--oracle-red)', fontWeight: 700, flexShrink: 0 }}>▸</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation — only for lesson/summary */}
      {step.type !== 'quiz' && step.type !== 'summary' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleNext}>
            {isLastStep ? 'Finish Module 🎓' : 'Next Step →'}
          </Button>
        </div>
      )}
    </div>
  );
}
