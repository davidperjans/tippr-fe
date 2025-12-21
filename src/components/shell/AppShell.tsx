import { Outlet } from 'react-router-dom'
import { TopNavbar } from './TopNavbar'

export function AppShell() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans text-foreground antialiased">
            {/* Top Navigation Bar */}
            <TopNavbar />

            {/* Main Content Area - no overflow to enable sticky children */}
            <main className="flex-1 pt-16">
                <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
