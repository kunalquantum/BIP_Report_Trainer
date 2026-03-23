import React, { useState } from 'react';
import { useProgress } from '../../hooks/useProgress.js';
import Button from '../Common/Button.jsx';

export default function QuizEngine({ questions, moduleId, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [done, setDone] = useState(false);
  const { completeQuiz } = useProgress();

  const q = questions[current];
  const isCorrect = selected === q?.correct;
  const finalResults = done ? results : null;

  function handleSelect(idx) {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
  }

  function handleNext() {
    const newResult = { questionId: q.id, correct: selected === q.correct };
    const newResults = [...results, newResult];

    if (current + 1 >= questions.length) {
      completeQuiz(moduleId, newResults);
      setResults(newResults);
      setDone(true);
    } else {
      setResults(newResults);
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  }

  if (done) {
    const correct = results.filter(r => r.correct).length;
    const score = Math.round((correct / questions.length) * 100);
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-6)', animation: 'scaleIn 0.3s ease' }}>
        <div style={{ fontSize: 64, marginBottom: 'var(--space-4)' }}>
          {score >= 80 ? '🎉' : score >= 50 ? '📚' : '💪'}
        </div>
        <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
          Quiz Complete!
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)' }}>
          You scored <strong style={{ color: score >= 80 ? 'var(--color-success)' : 'var(--color-warning)' }}>{correct}/{questions.length}</strong> ({score}%)
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-5)',
        }}>
          {results.map((r, i) => (
            <div key={i} style={{
              width: 36, height: 36, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: r.correct ? 'rgba(63,185,80,0.15)' : 'rgba(248,81,73,0.15)',
              border: `2px solid ${r.correct ? 'var(--color-success)' : 'var(--color-error)'}`,
              fontSize: 16,
            }}>{r.correct ? '✓' : '✗'}</div>
          ))}
        </div>
        <Button onClick={onComplete} variant={score >= 80 ? 'success' : 'primary'}>
          {score >= 80 ? '🚀 Continue to Next Step' : '📖 Review & Continue'}
        </Button>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.25s ease' }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Question {current + 1} of {questions.length}
        </span>
        <div style={{ flex: 1, height: 4, background: 'var(--color-surface-3)', borderRadius: 999 }}>
          <div style={{
            height: '100%', borderRadius: 999,
            background: 'var(--oracle-red)',
            width: `${((current) / questions.length) * 100}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Question */}
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--space-5)',
        lineHeight: 1.4,
      }}>
        {q.question}
      </h3>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {q.options.map((option, idx) => {
          let bg = 'var(--color-surface-2)';
          let border = 'var(--color-border)';
          let color = 'var(--color-text-primary)';

          if (selected !== null) {
            if (idx === q.correct) { bg = 'rgba(63,185,80,0.12)'; border = 'var(--color-success)'; color = 'var(--color-success)'; }
            else if (idx === selected && selected !== q.correct) { bg = 'rgba(248,81,73,0.12)'; border = 'var(--color-error)'; color = 'var(--color-error)'; }
          }

          return (
            <div
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                padding: 'var(--space-4)',
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 'var(--radius-md)',
                cursor: selected !== null ? 'default' : 'pointer',
                color,
                fontWeight: idx === selected || idx === q.correct ? 600 : 400,
                transition: 'all 150ms ease',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
              }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--color-surface-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--text-xs)', fontWeight: 700, flexShrink: 0,
              }}>
                {String.fromCharCode(65 + idx)}
              </span>
              {option}
              {selected !== null && idx === q.correct && <span style={{ marginLeft: 'auto' }}>✓</span>}
              {selected !== null && idx === selected && selected !== q.correct && <span style={{ marginLeft: 'auto' }}>✗</span>}
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div style={{
          marginTop: 'var(--space-4)',
          padding: 'var(--space-4)',
          background: isCorrect ? 'rgba(63,185,80,0.08)' : 'rgba(248,81,73,0.08)',
          border: `1px solid ${isCorrect ? 'rgba(63,185,80,0.3)' : 'rgba(248,81,73,0.3)'}`,
          borderRadius: 'var(--radius-md)',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: isCorrect ? 'var(--color-success)' : 'var(--color-error)', marginBottom: 4 }}>
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>{q.explanation}</p>
        </div>
      )}

      {selected !== null && (
        <div style={{ marginTop: 'var(--space-5)', display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleNext}>
            {current + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
          </Button>
        </div>
      )}
    </div>
  );
}
