import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Check if pre-launch mode is enabled
const PRE_LAUNCH_MODE = import.meta.env.VITE_PRE_LAUNCH === 'true'

async function bootstrap() {
  // Dynamically import the right app based on pre-launch mode
  // This ensures the full app bundle is NOT loaded when pre-launch is enabled
  const AppComponent = PRE_LAUNCH_MODE
    ? (await import('./PreLaunchApp')).default
    : (await import('./App')).default

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppComponent />
    </StrictMode>,
  )
}

bootstrap()
