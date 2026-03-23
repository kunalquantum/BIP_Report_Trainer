import { useState } from 'react'
import { useTrainer } from '../../context/TrainerContext'

export default function ModulePlayer() {
    const { state, dispatch } = useTrainer()
    const mod = state.currentModule
    const step = mod?.steps[state.currentStep]
    const isLast = state.currentStep === mod?.steps.length - 1
    const progress = ((state.currentStep + 1) / mod?.steps.length) * 100

    if (!mod) return null

    return (
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

            {/* ── Left: Steps Sidebar ── */}
            <aside style={{
                width: '260px',
                background: 'var(--oracle-navy)',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto'
            }}>
                {/* Module header */}
                <div style={{
                    padding: 'var(--space-lg)',
                    borderBottom: '1px solid rgba(255,255,255,0.07)'
                }}>
                    <div style={{
                        fontSize: '10px',
                        letterSpacing: '1.2px',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.3)',
                        marginBottom: '6px'
                    }}>
                        {mod.id}
                    </div>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'white',
                        lineHeight: 1.4,
                        marginBottom: '10px'
                    }}>
                        {mod.title}
                    </div>
                    {/* Progress bar */}
                    <div style={{
                        height: '4px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '2px'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: 'var(--oracle-red)',
                            borderRadius: '2px',
                            transition: 'width 0.4s ease'
                        }} />
                    </div>
                    <div style={{
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.3)',
                        marginTop: '6px'
                    }}>
                        Step {state.currentStep + 1} of {mod.steps.length}
                    </div>
                </div>

                {/* Step list */}
                <div style={{ flex: 1, padding: 'var(--space-sm) 0' }}>
                    {mod.steps.map((s, i) => {
                        const done = i < state.currentStep
                        const active = i === state.currentStep
                        return (
                            <div
                                key={i}
                                onClick={() => dispatch({ type: 'GO_TO_STEP', payload: i })}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-sm)',
                                    padding: '9px var(--space-lg)',
                                    cursor: 'pointer',
                                    borderLeft: active
                                        ? '3px solid var(--oracle-red)'
                                        : '3px solid transparent',
                                    background: active
                                        ? 'rgba(199,70,52,0.15)'
                                        : 'transparent',
                                    transition: 'background 0.15s'
                                }}
                                onMouseEnter={e => {
                                    if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                                }}
                                onMouseLeave={e => {
                                    if (!active) e.currentTarget.style.background = 'transparent'
                                }}
                            >
                                {/* Step number / done indicator */}
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    background: done
                                        ? 'var(--oracle-success)'
                                        : active
                                            ? 'var(--oracle-red)'
                                            : 'rgba(255,255,255,0.1)',
                                    color: 'white'
                                }}>
                                    {done ? '✓' : i + 1}
                                </div>

                                <div>
                                    <div style={{
                                        fontSize: '12px',
                                        fontWeight: active ? 600 : 400,
                                        color: active ? 'white' : done ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)',
                                        lineHeight: 1.3
                                    }}>
                                        {s.title}
                                    </div>
                                    <div style={{
                                        fontSize: '10px',
                                        color: 'rgba(255,255,255,0.25)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {s.type}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Back to dashboard */}
                <div style={{ padding: 'var(--space-md)' }}>
                    <button
                        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
                        style={{
                            width: '100%',
                            padding: '8px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </aside>

            {/* ── Right: Step Content ── */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: 'var(--space-xl)',
                background: 'var(--oracle-silver)'
            }}>
                {step && (
                    <>
                        {/* Step type badge */}
                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <StepTypeBadge type={step.type} />
                        </div>

                        {/* Step title */}
                        <h2 style={{
                            fontSize: '22px',
                            fontWeight: 700,
                            color: 'var(--oracle-navy)',
                            marginBottom: 'var(--space-lg)'
                        }}>
                            {step.title}
                        </h2>

                        {/* Step body — rendered by type */}
                        <StepBody
                            step={step}
                            moduleId={mod.id}
                            stepIndex={state.currentStep}
                        />

                        {/* Navigation */}
                        <StepNav
                            currentStep={state.currentStep}
                            totalSteps={mod.steps.length}
                            isLast={isLast}
                            moduleId={mod.id}
                            modulePoints={mod.pointsOnComplete}
                            stepType={step.type}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────
// Step Type Badge
// ─────────────────────────────────────────────

function StepTypeBadge({ type }) {
    const config = {
        lesson: { label: 'Lesson', bg: '#0277BD' },
        code: { label: 'Code', bg: '#2E7D32' },
        quiz: { label: 'Quiz', bg: '#7B1FA2' },
        scenario: { label: 'Scenario', bg: '#E65100' }
    }
    const c = config[type] || { label: type, bg: '#888' }
    return (
        <span style={{
            background: c.bg,
            color: 'white',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            padding: '3px 10px',
            borderRadius: '3px'
        }}>
            {c.label}
        </span>
    )
}

// ─────────────────────────────────────────────
// Step Body — switches on type
// ─────────────────────────────────────────────

function StepBody({ step, moduleId, stepIndex }) {
    if (step.type === 'lesson') return <LessonStep step={step} />
    if (step.type === 'code') return <CodeStep step={step} />
    if (step.type === 'quiz') return <QuizStep step={step} moduleId={moduleId} stepIndex={stepIndex} />
    return (
        <div style={{ color: 'var(--oracle-text-light)', fontSize: '14px' }}>
            Unknown step type: {step.type}
        </div>
    )
}

// ─────────────────────────────────────────────
// Lesson Step
// ─────────────────────────────────────────────

function LessonStep({ step }) {
    return (
        <div style={{
            background: 'var(--oracle-white)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-xl)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: 'var(--space-xl)'
        }}>
            <p style={{
                fontSize: '14px',
                lineHeight: 1.8,
                color: 'var(--oracle-text-light)',
                marginBottom: step.keyPoints ? 'var(--space-xl)' : 0
            }}>
                {step.content}
            </p>

            {step.keyPoints && (
                <>
                    <div style={{
                        borderTop: 'var(--border-default)',
                        paddingTop: 'var(--space-lg)',
                        marginTop: 'var(--space-lg)'
                    }}>
                        <div style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            color: 'var(--oracle-navy)',
                            marginBottom: 'var(--space-md)'
                        }}>
                            Key Points
                        </div>
                        {step.keyPoints.map((kp, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                gap: 'var(--space-sm)',
                                alignItems: 'flex-start',
                                marginBottom: 'var(--space-sm)',
                                padding: 'var(--space-sm) var(--space-md)',
                                background: 'var(--oracle-silver)',
                                borderRadius: 'var(--radius-sm)',
                                borderLeft: '3px solid var(--oracle-red)'
                            }}>
                                <span style={{
                                    color: 'var(--oracle-red)',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    flexShrink: 0,
                                    marginTop: '1px'
                                }}>
                                    ›
                                </span>
                                <span style={{
                                    fontSize: '13px',
                                    color: 'var(--oracle-text)',
                                    lineHeight: 1.5
                                }}>
                                    {kp}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

// ─────────────────────────────────────────────
// Code Step
// ─────────────────────────────────────────────

function CodeStep({ step }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(step.codeExample)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div style={{ marginBottom: 'var(--space-xl)' }}>
            {/* Explanation card */}
            <div style={{
                background: 'var(--oracle-white)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-xl)',
                boxShadow: 'var(--shadow-card)',
                marginBottom: 'var(--space-md)'
            }}>
                <p style={{
                    fontSize: '14px',
                    lineHeight: 1.8,
                    color: 'var(--oracle-text-light)'
                }}>
                    {step.content}
                </p>
            </div>

            {/* Code block */}
            <div style={{
                background: 'var(--oracle-navy)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)'
            }}>
                {/* Code toolbar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px var(--space-lg)',
                    background: 'rgba(0,0,0,0.2)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}>
                    <span style={{
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.35)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}>
                        SQL
                    </span>
                    <button
                        onClick={handleCopy}
                        style={{
                            background: copied ? 'var(--oracle-success)' : 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '11px',
                            padding: '3px 10px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        {copied ? '✓ Copied' : 'Copy'}
                    </button>
                </div>

                {/* Code content */}
                <pre style={{
                    margin: 0,
                    padding: 'var(--space-lg)',
                    fontSize: '13px',
                    lineHeight: 1.7,
                    color: '#A8D8EA',
                    fontFamily: 'var(--font-mono)',
                    overflowX: 'auto',
                    whiteSpace: 'pre'
                }}>
                    {step.codeExample}
                </pre>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────
// Quiz Step
// ─────────────────────────────────────────────

function QuizStep({ step, moduleId, stepIndex }) {
    const { dispatch } = useTrainer()
    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)

    const score = submitted
        ? step.questions.filter((q, i) => answers[i] === q.answer).length
        : 0

    const handleSubmit = () => {
        if (Object.keys(answers).length < step.questions.length) return
        setSubmitted(true)
        const pct = Math.round((score / step.questions.length) * 100)
        dispatch({
            type: 'SAVE_QUIZ_SCORE',
            payload: {
                key: `${moduleId}-step${stepIndex}`,
                score: pct
            }
        })
        if (pct === 100) {
            dispatch({ type: 'ADD_POINTS', payload: 20 })
        }
    }

    return (
        <div style={{ marginBottom: 'var(--space-xl)' }}>
            {/* Intro card */}
            <div style={{
                background: 'var(--oracle-white)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-lg)',
                boxShadow: 'var(--shadow-card)',
                marginBottom: 'var(--space-lg)',
                borderLeft: '4px solid #7B1FA2'
            }}>
                <p style={{ fontSize: '13px', color: 'var(--oracle-text-light)' }}>
                    {step.content}
                </p>
            </div>

            {/* Questions */}
            {step.questions.map((q, qi) => (
                <div key={qi} style={{
                    background: 'var(--oracle-white)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-lg)',
                    boxShadow: 'var(--shadow-card)',
                    marginBottom: 'var(--space-md)'
                }}>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--oracle-navy)',
                        marginBottom: 'var(--space-md)',
                        display: 'flex',
                        gap: 'var(--space-sm)'
                    }}>
                        <span style={{
                            background: '#7B1FA2',
                            color: 'white',
                            borderRadius: '50%',
                            width: '22px', height: '22px',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            flexShrink: 0
                        }}>
                            {qi + 1}
                        </span>
                        {q.q}
                    </div>

                    {/* Options */}
                    {q.options.map((opt, oi) => {
                        const selected = answers[qi] === oi
                        const isCorrect = submitted && oi === q.answer
                        const isWrong = submitted && selected && oi !== q.answer

                        return (
                            <div
                                key={oi}
                                onClick={() => !submitted && setAnswers({ ...answers, [qi]: oi })}
                                style={{
                                    padding: '10px var(--space-md)',
                                    marginBottom: '6px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: `1px solid ${isCorrect ? 'var(--oracle-success)'
                                            : isWrong ? 'var(--oracle-red)'
                                                : selected ? 'var(--oracle-navy)'
                                                    : 'var(--oracle-silver-mid)'
                                        }`,
                                    background: isCorrect ? '#E8F5E9'
                                        : isWrong ? '#FFEBEE'
                                            : selected ? '#EBF4FF'
                                                : 'var(--oracle-white)',
                                    cursor: submitted ? 'default' : 'pointer',
                                    fontSize: '13px',
                                    color: 'var(--oracle-text)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-sm)',
                                    transition: 'border-color 0.15s, background 0.15s'
                                }}
                            >
                                <span style={{
                                    width: '18px', height: '18px',
                                    borderRadius: '50%',
                                    border: `2px solid ${isCorrect ? 'var(--oracle-success)'
                                            : isWrong ? 'var(--oracle-red)'
                                                : selected ? 'var(--oracle-navy)'
                                                    : 'var(--oracle-silver-mid)'
                                        }`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '10px',
                                    flexShrink: 0,
                                    color: isCorrect ? 'var(--oracle-success)' : isWrong ? 'var(--oracle-red)' : 'var(--oracle-navy)'
                                }}>
                                    {isCorrect ? '✓' : isWrong ? '✕' : selected ? '●' : ''}
                                </span>
                                {opt}
                            </div>
                        )
                    })}

                    {/* Explanation */}
                    {submitted && (
                        <div style={{
                            marginTop: 'var(--space-sm)',
                            padding: 'var(--space-sm) var(--space-md)',
                            background: '#F0F4FF',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '12px',
                            color: '#0277BD',
                            borderLeft: '3px solid #0277BD'
                        }}>
                            💡 {q.explanation}
                        </div>
                    )}
                </div>
            ))}

            {/* Score / Submit */}
            {!submitted ? (
                <button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length < step.questions.length}
                    style={{
                        padding: '10px 28px',
                        background: Object.keys(answers).length < step.questions.length
                            ? 'var(--oracle-silver-mid)'
                            : 'var(--oracle-navy)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: Object.keys(answers).length < step.questions.length
                            ? 'not-allowed' : 'pointer'
                    }}
                >
                    Submit Answers
                </button>
            ) : (
                <div style={{
                    padding: 'var(--space-lg)',
                    background: score === step.questions.length ? '#E8F5E9' : '#FFF8E1',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `4px solid ${score === step.questions.length ? 'var(--oracle-success)' : 'var(--oracle-warning)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-md)'
                }}>
                    <span style={{ fontSize: '28px' }}>
                        {score === step.questions.length ? '🏆' : '📝'}
                    </span>
                    <div>
                        <div style={{
                            fontWeight: 700,
                            fontSize: '15px',
                            color: score === step.questions.length
                                ? 'var(--oracle-success)'
                                : 'var(--oracle-warning)'
                        }}>
                            {score}/{step.questions.length} correct
                            {score === step.questions.length && ' — Perfect score! +20 pts'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--oracle-text-light)', marginTop: '2px' }}>
                            {score === step.questions.length
                                ? 'Excellent! You can proceed to the next step.'
                                : 'Review the explanations above, then continue.'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ─────────────────────────────────────────────
// Step Navigation
// ─────────────────────────────────────────────

function StepNav({ currentStep, totalSteps, isLast, moduleId, modulePoints, stepType }) {
    const { dispatch } = useTrainer()

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'var(--space-xl)',
            paddingTop: 'var(--space-lg)',
            borderTop: 'var(--border-default)'
        }}>
            <button
                onClick={() => dispatch({ type: 'PREV_STEP' })}
                disabled={currentStep === 0}
                style={{
                    padding: '10px 24px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'var(--border-default)',
                    background: 'var(--oracle-white)',
                    color: 'var(--oracle-text)',
                    fontSize: '13px',
                    cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentStep === 0 ? 0.4 : 1
                }}
            >
                ← Previous
            </button>

            {/* Step dots */}
            <div style={{ display: 'flex', gap: '6px' }}>
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} style={{
                        width: i === currentStep ? '20px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        background: i < currentStep
                            ? 'var(--oracle-success)'
                            : i === currentStep
                                ? 'var(--oracle-red)'
                                : 'var(--oracle-silver-mid)',
                        transition: 'width 0.3s ease, background 0.3s ease'
                    }} />
                ))}
            </div>

            {isLast ? (
                <button
                    onClick={() => dispatch({
                        type: 'COMPLETE_MODULE',
                        payload: { moduleId, points: modulePoints }
                    })}
                    style={{
                        padding: '10px 28px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'var(--oracle-success)',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}
                >
                    Complete Module ✓
                </button>
            ) : (
                <button
                    onClick={() => dispatch({ type: 'NEXT_STEP' })}
                    style={{
                        padding: '10px 28px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'var(--oracle-red)',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}
                >
                    Next Step →
                </button>
            )}
        </div>
    )
}