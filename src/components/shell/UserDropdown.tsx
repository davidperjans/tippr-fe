import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { UserAvatar } from '@/components/UserAvatar'
import { LogOut, Settings, ChevronDown, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export function UserDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const { user, backendUser, signOut } = useAuth()

    const displayName = backendUser?.displayName || user?.user_metadata?.displayName || user?.email?.split('@')[0] || 'Användare'

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 p-1.5 rounded-xl transition-all duration-200",
                    "hover:bg-bg-subtle",
                    isOpen && "bg-bg-subtle"
                )}
            >
                <UserAvatar
                    user={{
                        username: displayName,
                        avatarUrl: backendUser?.avatarUrl,
                        email: user?.email
                    }}
                    className="w-8 h-8 ring-2 ring-brand-500/20"
                    fallbackClassName="text-white bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-semibold"
                />
                <ChevronDown className={cn(
                    "w-4 h-4 text-text-tertiary transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-bg-surface border border-border-subtle shadow-xl shadow-black/10 overflow-hidden z-50"
                    >
                        {/* User Info Header */}
                        <div className="p-3 border-b border-border-subtle bg-bg-subtle/30">
                            <div className="flex items-center gap-3">
                                <UserAvatar
                                    user={{
                                        username: displayName,
                                        avatarUrl: backendUser?.avatarUrl,
                                        email: user?.email
                                    }}
                                    className="w-10 h-10 ring-2 ring-brand-500/20"
                                    fallbackClassName="text-white bg-gradient-to-br from-brand-400 to-brand-600 font-semibold"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-text-primary truncate">{displayName}</p>
                                    <p className="text-xs text-text-tertiary truncate">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-1.5">
                            <Link
                                to="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-primary hover:bg-bg-subtle transition-colors group"
                            >
                                <User className="w-4 h-4 text-text-tertiary group-hover:text-brand-500 transition-colors" />
                                <span>Min Profil</span>
                            </Link>
                            <Link
                                to="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-primary hover:bg-bg-subtle transition-colors group"
                            >
                                <Settings className="w-4 h-4 text-text-tertiary group-hover:text-brand-500 transition-colors" />
                                <span>Inställningar</span>
                            </Link>
                        </div>

                        {/* Logout */}
                        <div className="p-1.5 border-t border-border-subtle">
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    signOut()
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-danger hover:bg-danger/10 transition-colors group"
                            >
                                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>Logga ut</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
