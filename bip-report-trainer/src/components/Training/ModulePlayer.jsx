import { useTrainer } from '../../context/TrainerContext';

export default function ModulePlayer() {
    const { state, dispatch } = useTrainer();
    const mod = state.currentModule;
    const step = mod?.steps[state.currentStep];
    const isLast = state.currentStep === (mod?.steps.length - 1);
    const progress = ((state.currentStep + 1) / mod?.steps.length) * 100;

    if (!mod) return null;

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            {/* Steps Sidebar */}
            <div style={{
                width: '260px',
                background: 'var(--oracle-navy)',
                padding: 'var(--space-lg)',
                overflowY: 'auto',
                flexShrink: 0
            }}>
                <div style={{ color: '#A0AEC0', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 'var(--space-md)' }}>
                    {mod.id}
                </div>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
                    {mod.title}
                </h3>
                {mod.steps.map((s, i) => (
                    <div key={i} style={{
                        display: 'flex', gap: 'var(--space-sm)',
                        padding: 'var(--space-sm) var(--space-md)',
                        marginBottom: '4px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        background: i === state.currentStep ? 'rgba(199,70,52,0.2)' : 'transparent',
                        borderLeft: i === state.currentStep ? '3px solid var(--oracle-red)' : '3px solid transparent',
                        transition: 'all 0.2s'
                    }}
                        onClick={() => dispatch({ type: 'NEXT_STEP', payload: i })}
                    >
                        <div style={{
                            width: '20px', height: '20px',
                            borderRadius: '50%',
                            background: i < state.currentStep ? '#2E7D32' : i === state.currentStep ? 'var(--oracle-red)' : 'rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', color: 'white', fontWeight: 700, flexShrink: 0
                        }}>
                            {i < state.currentStep ? '✓' : i + 1}
                        </div>
                        <span style={{ fontSize: '12px', color: i === state.currentStep ? 'white' : '#718096' }}>
                            {s.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: 'var(--space-xl)', overflowY: 'auto' }}>
                {/* Progress Bar */}
                <div style={{ marginBottom: 'var(--space-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--oracle-text-light)', marginBottom: '6px' }}>
                        <span>Step {state.currentStep + 1} of {mod.steps.length}</span>
                        <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--oracle-silver-mid)', borderRadius: '3px' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--oracle-red)', borderRadius: '3px', transition: 'width 0.5s ease' }} />
                    </div>
                </div>

                {step && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                            <span style={{
                                background: 'var(--oracle-red)', color: 'white',
                                fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                                borderRadius: '3px', letterSpacing: '0.5px', textTransform: 'uppercase'
                            }}>
                                {step.type}
                            </span>
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--oracle-navy)', marginBottom: 'var(--space-lg)' }}>
                            {step.title}
                        </h2>
                        <div style={{
                            background: 'white',
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--space-xl)',
                            boxShadow: 'var(--shadow-card)',
                            marginBottom: 'var(--space-xl)'
                        }}>
                            <p style={{ lineHeight: 1.7, color: 'var(--oracle-text-light)' }}>{step.content}</p>

                            {step.keyPoints && (
                                <div style={{ marginTop: 'var(--space-lg)', borderTop: 'var(--border-default)', paddingTop: 'var(--space-lg)' }}>
                                    <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: 'var(--space-md)', color: 'var(--oracle-navy)' }}>Key Points</div>
                                    {step.keyPoints.map((kp, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)', alignItems: 'flex-start' }}>
                                            <span style={{ color: 'var(--oracle-red)', fontWeight: 700, fontSize: '14px', marginTop: '2px' }}>›</span>
                                            <span style={{ fontSize: '13px', color: 'var(--oracle-text-light)' }}>{kp}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {step.codeExample && (
                                <div style={{ marginTop: 'var(--space-lg)' }}>
                                    <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: 'var(--space-sm)', color: 'var(--oracle-navy)' }}>SQL Example</div>
                                    <pre style={{
                                        background: '#1A2B4A', color: '#A8D8EA',
                                        padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)',
                                        fontSize: '13px', lineHeight: 1.7, overflowX: 'auto',
                                        fontFamily: 'var(--font-mono)', borderLeft: '4px solid var(--oracle-red)'
                                    }}>
                                        {step.codeExample}
                                    </pre>
                                </div>
                            )}

                            {step.type === 'quiz' && step.questions && (
                                <QuizSection questions={step.questions} />
                            )}
                        </div>

                        {/* Navigation */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button
                                onClick={() => dispatch({ type: 'PREV_STEP' })}
                                disabled={state.currentStep === 0}
                                style={{
                                    padding: '10px 24px', borderRadius: 'var(--radius-sm)',
                                    border: 'var(--border-default)', background: 'white',
                                    cursor: state.currentStep === 0 ? 'not-allowed' : 'pointer',
                                    opacity: state.currentStep === 0 ? 0.4 : 1, fontFamily: 'var(--font-primary)'
                                }}
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={() => {
                                    if (isLast) {
                                        dispatch({ type: 'COMPLETE_MODULE', payload: { moduleId: mod.id, points: 100 } });
                                    } else {
                                        dispatch({ type: 'NEXT_STEP' });
                                    }
                                }}
                                style={{
                                    padding: '10px 32px', borderRadius: 'var(--radius-sm)',
                                    border: 'none', background: 'var(--oracle-red)', color: 'white',
                                    cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-primary)',
                                    fontSize: '14px'
                                }}
                            >
                                {isLast ? 'Complete Module →' : 'Next Step →'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function QuizSection({ questions }) {
    const [answers, setAnswers] = React.useState({});
    const [submitted, setSubmitted] = React.useState(false);

    return (
        <div style={{ marginTop: 'var(--space-lg)' }}>
            {questions.map((q, qi) => (
                <div key={qi} style={{ marginBottom: 'var(--space-lg)' }}>
                    <div style={{ fontWeight: 600, marginBottom: 'var(--space-sm)' }}>{qi + 1}. {q.q}</div>
                    {q.options.map((opt, oi) => {
                        const selected = answers[qi] === oi;
                        const correct = submitted && oi === q.answer;
                        const wrong = submitted && selected && oi !== q.answer;
                        return (
                            <div key={oi}
                                onClick={() => !submitted && setAnswers({ ...answers, [qi]: oi })}
                                style={{
                                    padding: '10px 14px', marginBottom: '6px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: `1px solid ${correct ? '#2E7D32' : wrong ? 'var(--oracle-red)' : selected ? 'var(--oracle-navy)' : 'var(--oracle-silver-mid)'}`,
                                    background: correct ? '#E8F5E9' : wrong ? '#FFEBEE' : selected ? '#EBF2FF' : 'white',
                                    cursor: submitted ? 'default' : 'pointer', fontSize: '13px'
                                }}
                            >
                                {opt}
                            </div>
                        );
                    })}
                </div>
            ))}
            {!submitted && (
                <button onClick={() => setSubmitted(true)} style={{
                    background: 'var(--oracle-navy)', color: 'white',
                    border: 'none', padding: '10px 24px', borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer', fontFamily: 'var(--font-primary)'
                }}>
                    Submit Answers
                </button>
            )}
            {submitted && (
                <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: '#E8F5E9', borderRadius: 'var(--radius-sm)', color: '#2E7D32', fontWeight: 600 }}>
                    ✓ Quiz submitted! Review the highlighted answers above.
                </div>
            )}
        </div>
    );
}