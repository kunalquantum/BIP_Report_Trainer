import { useTrainer } from '../../context/TrainerContext';
import { getLevelForPoints } from '../../data/levels';

export default function TopNav() {
  const { state } = useTrainer();
  const level = getLevelForPoints(state.user.points);

  return (
    <header style={{
      background: 'var(--oracle-navy)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-xl)',
      height: '56px',
      borderBottom: '3px solid var(--oracle-red)',
      flexShrink: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <div style={{
          background: 'var(--oracle-red)',
          color: 'white',
          padding: '4px 10px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '0.5px'
        }}>ORACLE</div>
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#CBD5E0' }}>
          BIP Report Trainer
        </span>
      </div>

      {/* Nav Links */}
      <nav style={{ display: 'flex', gap: 'var(--space-xl)' }}>
        {['Dashboard', 'Modules', 'Scenarios', 'Leaderboard'].map(item => (
          <span key={item} style={{
            color: '#A0AEC0',
            cursor: 'pointer',
            fontSize: '13px',
            letterSpacing: '0.3px',
            transition: 'color 0.2s',
            padding: '4px 0',
            borderBottom: '2px solid transparent'
          }}
            onMouseEnter={e => { e.target.style.color = 'white'; e.target.style.borderBottomColor = 'var(--oracle-red)'; }}
            onMouseLeave={e => { e.target.style.color = '#A0AEC0'; e.target.style.borderBottomColor = 'transparent'; }}
          >
            {item}
          </span>
        ))}
      </nav>

      {/* User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <span style={{ fontSize: '18px' }}>{level.badge}</span>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600 }}>{state.user.name}</div>
          <div style={{ fontSize: '11px', color: '#A0AEC0' }}>{level.title} · {state.user.points} pts</div>
        </div>
        <div style={{
          width: '32px', height: '32px',
          borderRadius: '50%',
          background: 'var(--oracle-red)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '14px'
        }}>
          {state.user.name[0]}
        </div>
      </div>
    </header>
  );
}