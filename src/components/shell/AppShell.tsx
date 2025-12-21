import { Outlet } from 'react-router-dom'
import { LeftRail } from './LeftRail'
import { TopContextBar } from './TopContextBar'
import { RightPulsePanel } from './RightPulsePanel'
import { DashboardMobileNav } from '../dashboard/DashboardMobileNav'

export function AppShell() {
    return (
        <div className="min-h-screen bg-background flex font-sans text-foreground antialiased">
            {/* Left Navigation Rail (Desktop) */}
            <LeftRail />

            {/* Main Content Area Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Top Context Bar */}
                <TopContextBar />

                {/* Content & Right Panel Grid */}
                <div className="flex-1 flex min-h-0">
                    {/* Scrollable Main Stage */}
                    <main className="flex-1 overflow-y-auto pb-24 md:pb-8 relative scrollbar-thin">
                        <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full animate-fade-in">
                            <Outlet />
                        </div>
                    </main>

                    {/* Right Pulse Panel (Desktop XL+) */}
                    <RightPulsePanel />
                </div>
            </div>

            {/* Mobile Navigation (Fixed Bottom) */}
            <DashboardMobileNav />
        </div>
    )
}
