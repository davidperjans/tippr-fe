import { Outlet, Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    Trophy,
    Calendar,
    Shield,
    ArrowLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ADMIN_NAV = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/users', label: 'Användare', icon: Users },
    { to: '/admin/leagues', label: 'Ligor', icon: Trophy },
    { to: '/admin/matches', label: 'Matcher', icon: Calendar },
    { to: '/admin/tournaments', label: 'Turneringar', icon: Trophy },
]

export function AdminLayout() {
    const location = useLocation()

    const isActive = (path: string, exact?: boolean) => {
        if (exact) return location.pathname === path
        return location.pathname.startsWith(path)
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border-subtle bg-bg-surface shrink-0 hidden lg:block">
                <div className="p-4 border-b border-border-subtle">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-text-primary">Admin Panel</h2>
                            <p className="text-xs text-text-tertiary">Hantera Tippr</p>
                        </div>
                    </div>
                </div>

                <nav className="p-3 space-y-1">
                    {ADMIN_NAV.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.to, item.exact)
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                    active
                                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                        : "text-text-secondary hover:text-text-primary hover:bg-bg-subtle"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-3 mt-auto border-t border-border-subtle">
                    <Link
                        to="/home"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Tillbaka till appen
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-bg-surface border-b border-border-subtle">
                <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-amber-500" />
                        <span className="font-semibold text-sm">Admin</span>
                    </div>
                    <Link to="/home" className="text-xs text-text-secondary hover:text-text-primary">
                        ← Tillbaka
                    </Link>
                </div>
                <nav className="flex gap-1 px-3 pb-3 overflow-x-auto">
                    {ADMIN_NAV.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.to, item.exact)
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                                    active
                                        ? "bg-amber-500/10 text-amber-600"
                                        : "text-text-secondary hover:bg-bg-subtle"
                                )}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-8 lg:pt-6 pt-28 bg-background">
                <div className="max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
