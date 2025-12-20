import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Trophy, Target, BarChart2, Globe, Info, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const navItemVariants = cva(
    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
    {
        variants: {
            active: {
                true: "bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium shadow-md shadow-brand-500/25",
                false: "text-text-secondary hover:bg-bg-subtle hover:text-text-primary",
            },
            collapsed: {
                true: "justify-center px-2",
                false: "",
            },
        },
        defaultVariants: {
            active: false,
            collapsed: false,
        },
    }
)

export function LeftRail() {
    const [isCollapsed, setIsCollapsed] = useState(false)

    const menuItems = [
        { path: '/overview', label: 'Översikt', icon: Home },
        { path: '/tournaments', label: 'Turneringar', icon: Globe },
        { path: '/leagues', label: 'Mina Ligor', icon: Trophy },
        { path: '/betting', label: 'Tippa', icon: Target },
        { path: '/standings', label: 'Topplista', icon: BarChart2 },
        { path: '/information', label: 'Information', icon: Info },
    ]

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col bg-bg-surface border-r border-border-subtle h-screen sticky top-0 z-40 transition-[width] duration-300 ease-in-out",
                isCollapsed ? "w-[68px]" : "w-60"
            )}
        >
            {/* Brand Header */}
            <div className={cn("h-14 flex items-center border-b border-border-subtle", isCollapsed ? "justify-center px-2" : "px-4")}>
                <div className="flex items-center gap-2.5">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 shrink-0">
                            <Sparkles className="w-4.5 h-4.5 text-white" />
                        </div>
                    </div>
                    <div className={cn("transition-all duration-200 overflow-hidden", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                        <span className="text-lg font-bold tracking-tight text-text-primary">
                            Tippr
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2.5 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(navItemVariants({ active: isActive, collapsed: isCollapsed }))}
                        title={isCollapsed ? item.label : undefined}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={cn(
                                    "w-5 h-5 shrink-0 transition-all duration-200",
                                    isActive ? "text-white" : "text-text-tertiary group-hover:text-brand-500"
                                )} />
                                {!isCollapsed && (
                                    <span className="truncate text-sm">{item.label}</span>
                                )}
                                {isCollapsed && isActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-500 rounded-l-full" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Collapse Toggle */}
            <div className="p-2.5 border-t border-border-subtle">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full h-8 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-subtle rounded-lg transition-all duration-200"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>
        </aside>
    )
}
