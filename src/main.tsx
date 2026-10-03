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
