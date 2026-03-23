import TopNav from './components/Layout/TopNav'
import Sidebar from './components/Layout/Sidebar'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopNav />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{
          flex: 1,
          overflowY: 'auto',
          background: 'var(--oracle-silver)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <p style={{ color: 'var(--oracle-text-light)', fontSize: '14px' }}>
            Dashboard coming next
          </p>
        </main>
      </div>
    </div>
  )
}