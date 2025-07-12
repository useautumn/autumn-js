import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AutumnProvider } from 'autumn-js/react'

createRoot(document.getElementById('root')!).render(
  <AutumnProvider backendUrl="http://localhost:3000">
    <StrictMode>
      <App />
    </StrictMode>
  </AutumnProvider>,
)
