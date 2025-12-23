import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, Users, Menu, X, Info, Shield } from "lucide-react"
import { UserDropdown } from "./UserDropdown"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"

const NAV_LINKS = [
    { to: "/home", label: "Hem", icon: Home },
    { to: "/leagues", label: "Ligor", icon: Users },
    { to: "/information", label: "Information", icon: Info },
]

export function TopNavbar() {
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { isAdmin } = useAuth()

    const isActive = (path: string) => {
        if (path === "/home") {
            return location.pathname === "/home" || location.pathname === "/overview"
        }
        if (path === "/admin") {
            return location.pathname.startsWith("/admin")
        }
        return location.pathname.startsWith(path)
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-bg-surface/95 backdrop-blur-xl border-b border-border-subtle">
            <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Left: Logo */}
                <Link to="/home" className="flex items-center gap-3 shrink-0">
                    <img src="/newLogo.svg" alt="Tippr" className="w-8 h-8" />
                    <span className="text-lg font-bold text-text-primary hidden sm:block">Tippr</span>
                </Link>

                {/* Center: Nav Links (Desktop) */}
                <nav className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => {
                        const Icon = link.icon
                        const active = isActive(link.to)
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                    active
                                        ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                                        : "text-text-secondary hover:text-text-primary hover:bg-bg-subtle"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        )
                    })}

                    {/* Admin Link - Only visible to admins */}
                    {isAdmin && (
                        <Link
                            to="/admin"
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                isActive("/admin")
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    : "text-text-secondary hover:text-text-primary hover:bg-bg-subtle"
                            )}
                        >
                            <Shield className="w-4 h-4" />
                            Admin
                        </Link>
                    )}
                </nav>

                {/* Right: User Menu + Mobile Toggle */}
                <div className="flex items-center gap-3">
                    <UserDropdown />

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-bg-subtle transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-bg-surface border-b border-border-subtle overflow-hidden"
                    >
                        <nav className="p-4 space-y-1">
                            {NAV_LINKS.map((link) => {
                                const Icon = link.icon
                                const active = isActive(link.to)
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                            active
                                                ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                                                : "text-text-secondary hover:text-text-primary hover:bg-bg-subtle"
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {link.label}
                                    </Link>
                                )
                            })}

                            {/* Admin Link - Only visible to admins */}
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                        isActive("/admin")
                                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                            : "text-text-secondary hover:text-text-primary hover:bg-bg-subtle"
                                    )}
                                >
                                    <Shield className="w-5 h-5" />
                                    Admin
                                </Link>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
