import { DashboardSidebar } from './DashboardSidebar'
import { DashboardMobileNav } from './DashboardMobileNav'
import { Outlet } from 'react-router-dom'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
        {/* Desktop Sidebar - hidden on mobile via CSS in component */}
        <DashboardSidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-0 bg-background overflow-y-auto pb-20 md:pb-0">
             <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                  <Outlet />
             </div>
        </main>

        {/* Mobile Navigation - hidden on desktop via CSS in component */}
        <DashboardMobileNav />
    </div>
  )
}
