export default function TopNav() {
  return (
    <header style={{
      background: 'var(--oracle-navy)',
      color: 'white',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-xl)',
      borderBottom: '3px solid var(--oracle-red)',
      flexShrink: 0,
      zIndex: 100,
      position: 'sticky',
      top: 0
    }}>

      {/* Left: Logo + App Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <div style={{
          background: 'var(--oracle-red)',
          color: 'white',
          padding: '3px 10px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '1px'
        }}>
          ORACLE
        </div>
        <span style={{
          color: 'var(--oracle-silver-mid)',
          fontSize: '15px',
          fontWeight: 600,
          letterSpacing: '0.2px'
        }}>
          BIP Report Trainer
        </span>
      </div>

      {/* Center: Nav Links */}
      <nav style={{ display: 'flex', gap: 'var(--space-xl)' }}>
        {['Dashboard', 'Modules', 'Scenarios', 'Leaderboard'].map(item => (
          <NavLink key={item} label={item} />
        ))}
      </nav>

      {/* Right: User pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        background: 'rgba(255,255,255,0.07)',
        padding: '6px 14px 6px 8px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'var(--oracle-red)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '12px'
        }}>
          T
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.2 }}>Trainee</div>
          <div style={{ fontSize: '11px', color: 'var(--oracle-silver-dark)', lineHeight: 1.2 }}>
            🔰 BIP Novice
          </div>
        </div>
      </div>

    </header>
  )
}

function NavLink({ label }) {
  return (
    <span
      style={{
        color: '#A0AEC0',
        fontSize: '13px',
        letterSpacing: '0.3px',
        cursor: 'pointer',
        padding: '4px 0',
        borderBottom: '2px solid transparent',
        transition: 'color 0.15s, border-color 0.15s'
      }}
      onMouseEnter={e => {
        e.target.style.color = 'white'
        e.target.style.borderBottomColor = 'var(--oracle-red)'
      }}
      onMouseLeave={e => {
        e.target.style.color = '#A0AEC0'
        e.target.style.borderBottomColor = 'transparent'
      }}
    >
      {label}
    </span>
  )
}