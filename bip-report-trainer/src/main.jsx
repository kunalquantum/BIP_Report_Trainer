import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TrainerProvider } from './context/TrainerContext'
import './styles/oracle-theme.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TrainerProvider>
      <App />
    </TrainerProvider>
  </StrictMode>,
)