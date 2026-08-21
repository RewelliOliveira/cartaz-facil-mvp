import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LayoutsProvider } from './store/layoutsContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LayoutsProvider>
      <App />
    </LayoutsProvider>
  </StrictMode>,
)
