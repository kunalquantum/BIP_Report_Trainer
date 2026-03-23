import { useState } from 'react'

const NAV_ITEMS = [
  { icon: '⊞', label: 'Dashboard', id: 'dashboard' },
  { icon: '◫', label: 'Modules', id: 'modules' },
  { icon: '▷', label: 'Scenarios', id: 'scenarios' },
  { icon: '◈', label: 'Leaderboard', id: 'leaderboard' },
]

const MODULE_ITEMS = [
  { id: 'MOD-001', label: 'Intro to BIP', status: 'done' },
  { id: 'MOD-002', label: 'Data Models', status: 'active' },
  { id: 'MOD-003', label: 'Layouts & Templates', status: 'locked' },
  { id: 'MOD-004', label: 'Bursting & Delivery', status: 'locked' },
  { id: 'MOD-005', label: 'Scheduling & Admin', status: 'locked' },
]

export default function Sidebar() {
  const [active, setActive] = useState('dashboard')

  return (
    <aside style={{
      width: '220px',
      background: 'var(--oracle-navy-mid)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,0.06)',
      overflowY: 'auto'
    }}>

      {/* Main Nav */}
      <div style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '1.2px',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          padding: '0 var(--space-md)',
          marginBottom: 'var(--space-sm)'
        }}>
          Navigation
        </div>
        {NAV_ITEMS.map(item => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={active === item.id}
            onClick={() => setActive(item.id)}
          />
        ))}
      </div>

      {/* Modules List */}
      <div style={{ padding: 'var(--space-md) 0', flex: 1 }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '1.2px',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          padding: '0 var(--space-md)',
          marginBottom: 'var(--space-sm)'
        }}>
          Modules
        </div>
        {MODULE_ITEMS.map(mod => (
          <ModuleItem key={mod.id} mod={mod} />
        ))}
      </div>

      {/* Bottom: Progress Summary */}
      <div style={{
        padding: 'var(--space-md)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(0,0,0,0.15)'
      }}>
        <div style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '6px'
        }}>
          Overall Progress
        </div>
        <div style={{
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
          marginBottom: '6px'
        }}>
          <div style={{
            width: '20%',
            height: '100%',
            background: 'var(--oracle-red)',
            borderRadius: '2px',
            transition: 'width 0.6s ease'
          }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.35)'
        }}>
          <span>1 of 5 modules</span>
          <span>20%</span>
        </div>
      </div>

    </aside>
  )
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: '9px var(--space-md)',
        cursor: 'pointer',
        borderLeft: active ? '3px solid var(--oracle-red)' : '3px solid transparent',
        background: active ? 'rgba(199,70,52,0.15)' : 'transparent',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      <span style={{ fontSize: '14px', color: active ? 'var(--oracle-red-light)' : 'rgba(255,255,255,0.4)' }}>
        {icon}
      </span>
      <span style={{
        fontSize: '13px',
        fontWeight: active ? 600 : 400,
        color: active ? 'white' : 'rgba(255,255,255,0.55)'
      }}>
        {label}
      </span>
    </div>
  )
}

function ModuleItem({ mod }) {
  const statusColor = {
    done: 'var(--oracle-success)',
    active: 'var(--oracle-red)',
    locked: 'rgba(255,255,255,0.2)'
  }
  const statusIcon = {
    done: '✓',
    active: '▶',
    locked: '🔒'
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-sm)',
      padding: '7px var(--space-md)',
      cursor: mod.status === 'locked' ? 'not-allowed' : 'pointer',
      opacity: mod.status === 'locked' ? 0.45 : 1,
      transition: 'background 0.15s'
    }}
      onMouseEnter={e => { if (mod.status !== 'locked') e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >
      <span style={{
        fontSize: '11px',
        color: statusColor[mod.status],
        width: '14px',
        textAlign: 'center',
        flexShrink: 0
      }}>
        {statusIcon[mod.status]}
      </span>
      <div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.3 }}>
          {mod.label}
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
          {mod.id}
        </div>
      </div>
    </div>
  )
}