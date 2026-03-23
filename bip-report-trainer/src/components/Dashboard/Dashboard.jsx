import { useTrainer } from '../../context/TrainerContext';
import { BIP_MODULES } from '../../data/modules';
import { getLevelForPoints, LEVELS } from '../../data/levels';

export default function Dashboard() {
  const { state, dispatch } = useTrainer();
  const level = getLevelForPoints(state.user.points);
  const nextLevel = LEVELS[level.level] || null;
  const progressToNext = nextLevel
    ? ((state.user.points - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100
    : 100;

  return (
    <div style={{ padding: 'var(--space-xl)', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Welcome Banner */}
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
        <div style={{
          position: 'absolute', right: '-20px', top: '-20px',
          width: '200px', height: '200px',
          background: 'var(--oracle-red)',
          borderRadius: '50%',
          opacity: 0.1
        }} />
        <div>
          <div style={{ fontSize: '12px', color: '#A0AEC0', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
            Welcome back
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
            {state.user.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>{level.badge}</span>
            <span style={{ color: '#CBD5E0', fontSize: '14px' }}>{level.title}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--oracle-red)' }}>
            {state.user.points}
          </div>
          <div style={{ color: '#A0AEC0', fontSize: '13px' }}>Total Points</div>
          {nextLevel && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '11px', color: '#718096', marginBottom: '4px' }}>
                {nextLevel.minPoints - state.user.points} pts to {nextLevel.title}
              </div>
              <div style={{ width: '160px', height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '3px' }}>
                <div style={{ width: `${progressToNext}%`, height: '100%', background: 'var(--oracle-red)', borderRadius: '3px', transition: 'width 0.8s ease' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Modules Completed', value: state.user.completedModules.length, total: BIP_MODULES.length, color: 'var(--oracle-red)' },
          { label: 'Scenarios Passed', value: state.user.completedScenarios.length, total: 6, color: '#0277BD' },
          { label: 'Current Streak', value: '3 days', total: null, color: '#2E7D32' },
          { label: 'Certification Progress', value: '28%', total: null, color: '#7B1FA2' }
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'white',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)',
            boxShadow: 'var(--shadow-card)',
            borderTop: `3px solid ${stat.color}`
          }}>
            <div style={{ fontSize: '26px', fontWeight: 700, color: stat.color }}>
              {stat.value}{stat.total ? `/${stat.total}` : ''}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--oracle-text-light)', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Module Grid */}
      <h2 style={{
        fontSize: '16px', fontWeight: 600, color: 'var(--oracle-navy)',
        marginBottom: 'var(--space-md)',
        paddingBottom: 'var(--space-sm)',
        borderBottom: 'var(--border-default)'
      }}>
        Training Modules
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)' }}>
        {BIP_MODULES.map(mod => {
          const completed = state.user.completedModules.includes(mod.id);
          const locked = mod.difficulty === 'Advanced' && state.user.points < 300;
          return (
            <div key={mod.id} style={{
              background: 'white',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-lg)',
              boxShadow: 'var(--shadow-card)',
              borderLeft: `4px solid ${mod.color}`,
              opacity: locked ? 0.5 : 1,
              cursor: locked ? 'not-allowed' : 'pointer',
              transition: 'box-shadow 0.2s, transform 0.2s'
            }}
              onMouseEnter={e => { if (!locked) { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              onClick={() => !locked && dispatch({ type: 'START_MODULE', payload: mod })}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                <span style={{
                  fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px',
                  textTransform: 'uppercase', color: mod.color,
                  background: `${mod.color}15`, padding: '2px 8px',
                  borderRadius: '3px'
                }}>
                  {mod.difficulty}
                </span>
                {completed && <span style={{ color: '#2E7D32', fontSize: '14px' }}>✓ Done</span>}
                {locked && <span style={{ fontSize: '14px' }}>🔒</span>}
              </div>
              <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '6px', color: 'var(--oracle-navy)' }}>
                {mod.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--oracle-text-light)', marginBottom: 'var(--space-md)' }}>
                {mod.description}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#718096' }}>
                <span>⏱ {mod.estimatedTime}</span>
                <span>{mod.totalSteps} steps</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}