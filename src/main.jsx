import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { App } from '@/App'
import { ErrorBoundary } from '@/components/ui/error_boundary.component'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Failed to find root DOM element')
}

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)

if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    const swUrl = new URL('sw.js', window.location.href).href
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => {
        reg.update().catch(() => {})
      })
      .catch(() => {})
  })
}
