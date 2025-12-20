import { Bell, Search, Command } from 'lucide-react'
import { ThemeToggle } from '../theme/ThemeProvider'
import { UserDropdown } from './UserDropdown'

export function TopContextBar() {
    return (
        <header className="h-14 border-b border-border-subtle bg-bg-surface/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
            {/* Left: Breadcrumbs or Context Title */}
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center text-sm font-medium">
                    <span className="text-text-tertiary">Dashboard</span>
                    <span className="mx-2 text-text-tertiary/50">/</span>
                    <span className="text-text-primary font-semibold">Översikt</span>
                </div>
            </div>

            {/* Center: Global Search */}
            <div className="flex-1 max-w-md mx-4 hidden md:block">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-brand-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Sök ligor, lag..."
                        className="w-full h-9 pl-9 pr-16 bg-bg-subtle border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 bg-bg-muted rounded text-2xs text-text-tertiary font-medium">
                        <Command className="w-2.5 h-2.5" />
                        <span>K</span>
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-all duration-200">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-bg-surface" />
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-border-subtle mx-1" />

                {/* User Dropdown */}
                <UserDropdown />
            </div>
        </header>
    )
}
