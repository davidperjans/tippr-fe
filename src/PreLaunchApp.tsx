import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme/ThemeProvider'
import { PreLaunchPage } from './pages/PreLaunchPage'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'

/**
 * Minimal pre-launch app - only loads ThemeProvider and PreLaunchPage
 * This keeps the bundle size small when pre-launch mode is enabled
 */
function PreLaunchApp() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<PreLaunchPage />} />
                </Routes>
            </BrowserRouter>
            <SpeedInsights />
            <Analytics />
        </ThemeProvider>
    )
}

export default PreLaunchApp
