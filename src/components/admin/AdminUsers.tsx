import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Users, Search, Shield, User, Ban, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AdminUserListDto, UserRole } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { UserAvatar } from '@/components/UserAvatar'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'

export function AdminUsers() {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [page, setPage] = useState(1)
    const pageSize = 15
    const { token } = useAuth()
    const queryClient = useQueryClient()

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
            setPage(1) // Reset to first page on search
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Fetch users
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin', 'users', debouncedSearch, page, pageSize],
        queryFn: () => api.admin.users.list(token!, {
            search: debouncedSearch || undefined,
            page,
            pageSize
        }),
        enabled: !!token,
    })

    // Ban user mutation
    const banMutation = useMutation({
        mutationFn: (userId: string) => api.admin.users.ban(token!, userId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    })

    // Unban user mutation
    const unbanMutation = useMutation({
        mutationFn: (userId: string) => api.admin.users.unban(token!, userId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    })

    // Update role mutation
    const roleMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
            api.admin.users.updateRole(token!, userId, role),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    })

    const handleToggleBan = useCallback((user: AdminUserListDto) => {
        if (user.isBanned) {
            unbanMutation.mutate(user.id)
        } else {
            banMutation.mutate(user.id)
        }
    }, [banMutation, unbanMutation])

    const handleToggleRole = useCallback((user: AdminUserListDto) => {
        const newRole: UserRole = user.role === 1 ? 0 : 1
        roleMutation.mutate({ userId: user.id, role: newRole })
    }, [roleMutation])

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-'
        try {
            return format(new Date(dateStr), 'd MMM yyyy', { locale: sv })
        } catch {
            return '-'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Användare</h1>
                        <p className="text-text-secondary">
                            {data ? `${data.totalCount} användare totalt` : 'Hantera användarkonton och roller'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <Card className="p-4 bg-bg-surface border-border-subtle">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <Input
                        placeholder="Sök användare efter namn eller e-post..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-bg-subtle border-border-subtle"
                    />
                </div>
            </Card>

            {/* Users List */}
            <Card className="bg-bg-surface border-border-subtle overflow-hidden">
                {/* Table Header */}
                <div className="p-4 border-b border-border-subtle bg-bg-subtle/50">
                    <div className="grid grid-cols-12 gap-4 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                        <div className="col-span-4">Användare</div>
                        <div className="col-span-3">E-post</div>
                        <div className="col-span-2">Roll</div>
                        <div className="col-span-2">Senast inloggad</div>
                        <div className="col-span-1">Åtgärder</div>
                    </div>
                </div>

                <div className="divide-y divide-border-subtle">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <Loader2 className="w-8 h-8 mx-auto animate-spin text-brand-500" />
                            <p className="mt-2 text-text-secondary">Laddar användare...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">
                            <p>Kunde inte ladda användare</p>
                            <p className="text-sm mt-1 text-text-secondary">{(error as Error).message}</p>
                        </div>
                    ) : data?.items.length === 0 ? (
                        <div className="p-8 text-center text-text-tertiary">
                            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium text-text-secondary">Inga användare hittades</p>
                            {searchQuery && <p className="text-sm mt-1">Prova att ändra sökningen</p>}
                        </div>
                    ) : (
                        data?.items.map((user) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 hover:bg-bg-subtle/50 transition-colors"
                            >
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    {/* User Info */}
                                    <div className="col-span-4 flex items-center gap-3">
                                        <UserAvatar
                                            user={{
                                                username: user.displayName || user.username,
                                                avatarUrl: user.avatarUrl,
                                                email: user.email
                                            }}
                                            className="w-10 h-10"
                                        />
                                        <div className="min-w-0">
                                            <p className="font-medium text-text-primary truncate">
                                                {user.displayName || user.username || 'Okänd'}
                                            </p>
                                            {user.username && user.displayName && (
                                                <p className="text-xs text-text-tertiary truncate">@{user.username}</p>
                                            )}
                                            {user.isBanned && (
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-red-500/10 text-red-500 mt-1">
                                                    <Ban className="w-3 h-3" />
                                                    Bannlyst
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="col-span-3 text-sm text-text-secondary truncate">
                                        {user.email || '-'}
                                    </div>

                                    {/* Role */}
                                    <div className="col-span-2">
                                        <button
                                            onClick={() => handleToggleRole(user)}
                                            disabled={roleMutation.isPending}
                                            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${user.role === 1
                                                ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                                                : 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
                                                }`}
                                        >
                                            {user.role === 1 ? (
                                                <>
                                                    <Shield className="w-3 h-3" />
                                                    Admin
                                                </>
                                            ) : (
                                                <>
                                                    <User className="w-3 h-3" />
                                                    Användare
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Last Login */}
                                    <div className="col-span-2 text-sm text-text-secondary">
                                        {formatDate(user.lastLoginAt)}
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1">
                                        <button
                                            onClick={() => handleToggleBan(user)}
                                            disabled={banMutation.isPending || unbanMutation.isPending}
                                            className={`p-1.5 rounded-lg transition-colors ${user.isBanned
                                                ? 'text-green-500 hover:bg-green-500/10'
                                                : 'text-red-500 hover:bg-red-500/10'
                                                }`}
                                            title={user.isBanned ? 'Ta bort bannlysning' : 'Bannlys användare'}
                                        >
                                            <Ban className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                    <div className="p-4 border-t border-border-subtle bg-bg-subtle/30 flex items-center justify-between">
                        <p className="text-sm text-text-secondary">
                            Visar {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, data.totalCount)} av {data.totalCount}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={!data.hasPreviousPage}
                                className="p-2 rounded-lg hover:bg-bg-subtle disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm text-text-primary px-3">
                                Sida {page} av {data.totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={!data.hasNextPage}
                                className="p-2 rounded-lg hover:bg-bg-subtle disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Role Legend */}
            <Card className="p-4 bg-bg-surface border-border-subtle">
                <h3 className="text-sm font-medium text-text-primary mb-3">Roller & Åtgärder</h3>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <span className="text-sm text-text-secondary">Användare (0) - Klicka för att uppgradera</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Shield className="w-3.5 h-3.5 text-amber-500" />
                        </div>
                        <span className="text-sm text-text-secondary">Admin (1) - Klicka för att nedgradera</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <Ban className="w-3.5 h-3.5 text-red-500" />
                        </div>
                        <span className="text-sm text-text-secondary">Bannlys/Ta bort bannlysning</span>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}
