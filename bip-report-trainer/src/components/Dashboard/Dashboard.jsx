import { useTrainer } from '../../context/TrainerContext'
import { BIP_MODULES } from '../../data/modules'
import { SCENARIOS } from '../../data/scenarios'
import { getNextLevel, getProgressToNext } from '../../data/levels'

export default function Dashboard() {
  const { state, dispatch, level, isModuleDone, isModuleLocked, isScenarioDone } = useTrainer()
  const { user } = state

  const nextLevel = getNextLevel(user.points)
  const progressToNext = getProgressToNext(user.points)

  return (
    <div style={{ padding: 'var(--space-xl)', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

      {/* ── Welcome Banner ── */}
      <WelcomeBanner
        user={user}
        level={level}
        nextLevel={nextLevel}
        progressToNext={progressToNext}
      />

      {/* ── Stats Row ── */}
      <StatsRow user={user} />

      {/* ── Modules Grid ── */}
      <Section title="Training Modules" subtitle="Complete modules in order to unlock advanced content">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--space-md)'
        }}>
          {BIP_MODULES.map(mod => (
            <ModuleCard
              key={mod.id}
              mod={mod}
              done={isModuleDone(mod.id)}
              locked={isModuleLocked(mod)}
              onStart={() => dispatch({ type: 'START_MODULE', payload: mod })}
            />
          ))}
        </div>
      </Section>

      {/* ── Scenarios Grid ── */}
      <Section title="Practice Scenarios" subtitle="Apply your knowledge to real-world BIP challenges">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--space-md)'
        }}>
          {SCENARIOS.map(sc => (
            <ScenarioCard
              key={sc.id}
              scenario={sc}
              done={isScenarioDone(sc.id)}
              onStart={() => dispatch({ type: 'START_SCENARIO', payload: sc })}
            />
          ))}
        </div>
      </Section>

    </div>
  )
}

// ─────────────────────────────────────────────
// Welcome Banner
// ─────────────────────────────────────────────

function WelcomeBanner({ user, level, nextLevel, progressToNext }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--oracle-navy) 0%, var(--oracle-navy-light) 100%)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-xl)',
      color: 'white',
      marginBottom: 'var(--space-xl)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Decorative circles */}
      <div style={{
        position: 'absolute', right: '-30px', top: '-30px',
        width: '180px', height: '180px',
        borderRadius: '50%',
        background: 'var(--oracle-red)',
        opacity: 0.08
      }} />
      <div style={{
        position: 'absolute', right: '60px', bottom: '-40px',
        width: '120px', height: '120px',
        borderRadius: '50%',
        background: 'var(--oracle-accent)',
        opacity: 0.06
      }} />

      {/* Left: greeting */}
      <div style={{ position: 'relative' }}>
        <div style={{
          fontSize: '11px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '6px'
        }}>
          Welcome back
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '10px' }}>
          {user.name}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>{level.badge}</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{level.title}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
              Level {level.level} · {user.points} points total
            </div>
          </div>
        </div>
      </div>

      {/* Right: progress to next level */}
      <div style={{ position: 'relative', textAlign: 'right', minWidth: '200px' }}>
        {nextLevel ? (
          <>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
              Progress to {nextLevel.title}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--oracle-red-light)', lineHeight: 1 }}>
              {progressToNext}%
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: '6px 0 10px' }}>
              {nextLevel.minPoints - user.points} pts needed
            </div>
            <div style={{
              width: '100%', height: '6px',
              background: 'rgba(255,255,255,0.12)',
              borderRadius: '3px'
            }}>
              <div style={{
                width: `${progressToNext}%`,
                height: '100%',
                background: 'var(--oracle-red)',
                borderRadius: '3px',
                transition: 'width 1s ease'
              }} />
            </div>
          </>
        ) : (
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--oracle-red-light)' }}>
            🏆 Maximum Level Reached!
          </div>
        )}
      </div>

    </div>
  )
}

// ─────────────────────────────────────────────
// Stats Row
// ─────────────────────────────────────────────

function StatsRow({ user }) {
  const stats = [
    {
      label: 'Modules Completed',
      value: user.completedModules.length,
      total: BIP_MODULES.length,
      color: 'var(--oracle-red)',
      icon: '📘'
    },
    {
      label: 'Scenarios Passed',
      value: user.completedScenarios.length,
      total: SCENARIOS.length,
      color: '#0277BD',
      icon: '▷'
    },
    {
      label: 'Total Points',
      value: user.points,
      total: null,
      color: '#2E7D32',
      icon: '⭐'
    },
    {
      label: 'Quizzes Taken',
      value: Object.keys(user.quizScores).length,
      total: null,
      color: '#7B1FA2',
      icon: '✓'
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'var(--space-md)',
      marginBottom: 'var(--space-xl)'
    }}>
      {stats.map(s => (
        <div key={s.label} style={{
          background: 'var(--oracle-white)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-lg)',
          boxShadow: 'var(--shadow-card)',
          borderTop: `3px solid ${s.color}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-md)'
        }}>
          <span style={{ fontSize: '22px', marginTop: '2px' }}>{s.icon}</span>
          <div>
            <div style={{
              fontSize: '24px',
              fontWeight: 700,
              color: s.color,
              lineHeight: 1
            }}>
              {s.value}{s.total ? `/${s.total}` : ''}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--oracle-text-light)',
              marginTop: '4px'
            }}>
              {s.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// Section Wrapper
// ─────────────────────────────────────────────

function Section({ title, subtitle, children }) {
  return (
    <div style={{ marginBottom: 'var(--space-2xl)' }}>
      <div style={{
        marginBottom: 'var(--space-md)',
        paddingBottom: 'var(--space-sm)',
        borderBottom: 'var(--border-default)'
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--oracle-navy)',
          marginBottom: '2px'
        }}>
          {title}
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--oracle-text-light)' }}>
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────
// Module Card
// ─────────────────────────────────────────────

function ModuleCard({ mod, done, locked, onStart }) {
  return (
    <div
      onClick={() => !locked && onStart()}
      style={{
        background: 'var(--oracle-white)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-lg)',
        boxShadow: 'var(--shadow-card)',
        borderLeft: `4px solid ${locked ? 'var(--oracle-silver-mid)' : mod.color}`,
        opacity: locked ? 0.55 : 1,
        cursor: locked ? 'not-allowed' : 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
        position: 'relative'
      }}
      onMouseEnter={e => {
        if (!locked) {
          e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Top row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-sm)'
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          color: locked ? 'var(--oracle-silver-dark)' : mod.color,
          background: locked ? 'var(--oracle-silver)' : `${mod.color}15`,
          padding: '2px 8px',
          borderRadius: '3px'
        }}>
          {mod.difficulty}
        </span>
        <span style={{ fontSize: '18px' }}>
          {locked ? '🔒' : done ? '✅' : mod.icon}
        </span>
      </div>

      {/* Title & description */}
      <div style={{
        fontWeight: 700,
        fontSize: '14px',
        color: 'var(--oracle-navy)',
        marginBottom: '6px'
      }}>
        {mod.title}
      </div>
      <div style={{
        fontSize: '12px',
        color: 'var(--oracle-text-light)',
        lineHeight: 1.5,
        marginBottom: 'var(--space-md)'
      }}>
        {mod.description}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        color: 'var(--oracle-silver-dark)',
        borderTop: 'var(--border-default)',
        paddingTop: 'var(--space-sm)'
      }}>
        <span>⏱ {mod.estimatedTime}</span>
        <span>{mod.steps.length} steps</span>
        <span style={{
          fontWeight: 700,
          color: locked ? 'var(--oracle-silver-dark)' : mod.color
        }}>
          +{mod.pointsOnComplete} pts
        </span>
      </div>

      {/* Done ribbon */}
      {done && (
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          background: 'var(--oracle-success)',
          color: 'white',
          fontSize: '10px',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: '0 var(--radius-md) 0 var(--radius-md)',
          letterSpacing: '0.5px'
        }}>
          DONE
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Scenario Card
// ─────────────────────────────────────────────

function ScenarioCard({ scenario, done, onStart }) {
  const difficultyColor = {
    Beginner: '#2E7D32',
    Intermediate: '#0277BD',
    Advanced: '#C74634'
  }

  return (
    <div
      onClick={onStart}
      style={{
        background: 'var(--oracle-white)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-lg)',
        boxShadow: 'var(--shadow-card)',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
        position: 'relative',
        borderTop: `3px solid ${difficultyColor[scenario.difficulty] || '#888'}`
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Persona */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-md)',
        paddingBottom: 'var(--space-sm)',
        borderBottom: 'var(--border-default)'
      }}>
        <div style={{
          width: '34px', height: '34px',
          borderRadius: '50%',
          background: scenario.persona.avatarColor,
          color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, flexShrink: 0
        }}>
          {scenario.persona.avatar}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--oracle-navy)' }}>
            {scenario.persona.name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--oracle-text-light)' }}>
            {scenario.persona.role}
          </div>
        </div>
        <span style={{
          marginLeft: 'auto',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          color: difficultyColor[scenario.difficulty],
          background: `${difficultyColor[scenario.difficulty]}15`,
          padding: '2px 8px',
          borderRadius: '3px'
        }}>
          {scenario.difficulty}
        </span>
      </div>

      {/* Title & description */}
      <div style={{
        fontWeight: 700, fontSize: '14px',
        color: 'var(--oracle-navy)', marginBottom: '6px'
      }}>
        {scenario.title}
      </div>
      <div style={{
        fontSize: '12px', color: 'var(--oracle-text-light)',
        lineHeight: 1.5, marginBottom: 'var(--space-md)'
      }}>
        {scenario.description}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: 'var(--oracle-silver-dark)',
        borderTop: 'var(--border-default)',
        paddingTop: 'var(--space-sm)'
      }}>
        <span>⏱ {scenario.estimatedTime}</span>
        <span>{scenario.tasks.length} tasks</span>
        <span style={{ fontWeight: 700, color: '#0277BD' }}>
          +{scenario.pointsOnPass} pts
        </span>
      </div>

      {/* Done ribbon */}
      {done && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          background: 'var(--oracle-success)',
          color: 'white', fontSize: '10px', fontWeight: 700,
          padding: '3px 10px',
          borderRadius: '0 var(--radius-md) 0 var(--radius-md)',
          letterSpacing: '0.5px'
        }}>
          PASSED
        </div>
      )}
    </div>
  )
}