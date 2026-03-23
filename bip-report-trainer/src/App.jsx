import { useEffect } from 'react'
import { useTrainer } from './context/TrainerContext'
import TopNav from './components/Layout/TopNav'
import Sidebar from './components/Layout/Sidebar'
import Dashboard from './components/Dashboard/Dashboard'
import ModulePlayer from './components/Training/ModulePlayer'

export default function App() {
  const { state, dispatch } = useTrainer()

  useEffect(() => {
    if (!state.notification) return
    const t = setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 4000)
    return () => clearTimeout(t)
  }, [state.notification])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopNav />

      {state.notification && (
        <div style={{
          background: state.notification.type === 'success'
            ? 'var(--oracle-success)'
            : state.notification.type === 'error'
              ? 'var(--oracle-red)'
              : 'var(--oracle-accent)',
          color: 'white',
          padding: '10px var(--space-xl)',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 200
        }}>
          <span>
            {state.notification.type === 'success' ? '✓ ' : '✕ '}
            {state.notification.message}
          </span>
          <span
            style={{ cursor: 'pointer', opacity: 0.7, fontSize: '16px' }}
            onClick={() => dispatch({ type: 'CLEAR_NOTIFICATION' })}
          >
            ×
          </span>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--oracle-silver)' }}>
          {state.view === 'dashboard' && <Dashboard />}
          {state.view === 'module' && <ModulePlayer />}
          {state.view === 'scenario' && <div style={{ padding: 'var(--space-xl)', color: 'var(--oracle-text-light)' }}>Scenario Player — coming next</div>}
        </main>
      </div>
    </div>
  )
}