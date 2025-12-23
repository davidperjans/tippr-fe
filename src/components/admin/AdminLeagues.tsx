import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Trophy, Search, Users, Globe, Lock, ChevronLeft, ChevronRight, Loader2, X, Crown, RefreshCw, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AdminLeagueListDto, AdminLeagueMemberDto } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { UserAvatar } from '@/components/UserAvatar'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'

export function AdminLeagues() {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [page, setPage] = useState(1)
    const [selectedLeague, setSelectedLeague] = useState<AdminLeagueListDto | null>(null)
    const pageSize = 15
    const { token } = useAuth()
    const queryClient = useQueryClient()

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
            setPage(1)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Fetch leagues
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin', 'leagues', debouncedSearch, page, pageSize],
        queryFn: () => api.admin.leagues.list(token!, {
            search: debouncedSearch || undefined,
            page,
            pageSize
        }),
        enabled: !!token,
    })

    // Fetch members for selected league
    const { data: members, isLoading: membersLoading } = useQuery({
        queryKey: ['admin', 'league-members', selectedLeague?.id],
        queryFn: () => api.admin.leagues.getMembers(token!, selectedLeague!.id),
        enabled: !!token && !!selectedLeague,
    })

    // Recalculate standings
    const recalculateMutation = useMutation({
        mutationFn: (leagueId: string) => api.admin.leagues.recalculateStandings(token!, leagueId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'leagues'] })
            queryClient.invalidateQueries({ queryKey: ['admin', 'league-members'] })
        }
    })

    // Remove member
    const removeMemberMutation = useMutation({
        mutationFn: ({ leagueId, userId }: { leagueId: string; userId: string }) =>
            api.admin.leagues.removeMember(token!, leagueId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'league-members'] })
            queryClient.invalidateQueries({ queryKey: ['admin', 'leagues'] })
        }
    })

    const formatDate = (dateStr: string) => {
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
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Ligor</h1>
                        <p className="text-text-secondary">
                            {data ? `${data.totalCount} ligor totalt` : 'Hantera alla ligor'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <Card className="p-4 bg-bg-surface border-border-subtle">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <Input
                        placeholder="Sök liga efter namn..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-bg-subtle border-border-subtle"
                    />
                </div>
            </Card>

            {/* Leagues List */}
            <Card className="bg-bg-surface border-border-subtle overflow-hidden">
                {/* Table Header */}
                <div className="p-4 border-b border-border-subtle bg-bg-subtle/50">
                    <div className="grid grid-cols-12 gap-4 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                        <div className="col-span-4">Liga</div>
                        <div className="col-span-2">Turnering</div>
                        <div className="col-span-2">Ägare</div>
                        <div className="col-span-1">Typ</div>
                        <div className="col-span-1">Medlemmar</div>
                        <div className="col-span-2">Skapad</div>
                    </div>
                </div>

                <div className="divide-y divide-border-subtle">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <Loader2 className="w-8 h-8 mx-auto animate-spin text-brand-500" />
                            <p className="mt-2 text-text-secondary">Laddar ligor...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">
                            <p>Kunde inte ladda ligor</p>
                        </div>
                    ) : data?.items.length === 0 ? (
                        <div className="p-8 text-center text-text-tertiary">
                            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium text-text-secondary">Inga ligor hittades</p>
                        </div>
                    ) : (
                        data?.items.map((league) => (
                            <LeagueRow
                                key={league.id}
                                league={league}
                                onSelect={() => setSelectedLeague(league)}
                                onRecalculate={() => recalculateMutation.mutate(league.id)}
                                isRecalculating={recalculateMutation.isPending}
                                formatDate={formatDate}
                            />
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
                                className="p-2 rounded-lg hover:bg-bg-subtle disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm text-text-primary px-3">
                                Sida {page} av {data.totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={!data.hasNextPage}
                                className="p-2 rounded-lg hover:bg-bg-subtle disabled:opacity-50 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Members Modal */}
            <AnimatePresence>
                {selectedLeague && (
                    <MembersModal
                        league={selectedLeague}
                        members={members || []}
                        isLoading={membersLoading}
                        onClose={() => setSelectedLeague(null)}
                        onRemoveMember={(userId) => removeMemberMutation.mutate({ leagueId: selectedLeague.id, userId })}
                        isRemoving={removeMemberMutation.isPending}
                        formatDate={formatDate}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    )
}

interface LeagueRowProps {
    league: AdminLeagueListDto
    onSelect: () => void
    onRecalculate: () => void
    isRecalculating: boolean
    formatDate: (date: string) => string
}

function LeagueRow({ league, onSelect, onRecalculate, isRecalculating, formatDate }: LeagueRowProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 hover:bg-bg-subtle/50 transition-colors cursor-pointer"
            onClick={onSelect}
        >
            <div className="grid grid-cols-12 gap-4 items-center">
                {/* League Name */}
                <div className="col-span-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${league.isGlobal ? 'bg-amber-500/10' : 'bg-purple-500/10'} flex items-center justify-center`}>
                        {league.isGlobal ? (
                            <Globe className="w-5 h-5 text-amber-500" />
                        ) : (
                            <Trophy className="w-5 h-5 text-purple-500" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-text-primary truncate">{league.name}</p>
                        {league.description && (
                            <p className="text-xs text-text-tertiary truncate">{league.description}</p>
                        )}
                    </div>
                </div>

                {/* Tournament */}
                <div className="col-span-2 text-sm text-text-secondary truncate">
                    {league.tournamentName || '-'}
                </div>

                {/* Owner */}
                <div className="col-span-2 text-sm text-text-secondary truncate">
                    {league.ownerUsername || (league.isGlobal ? 'System' : '-')}
                </div>

                {/* Type */}
                <div className="col-span-1">
                    {league.isPublic ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-green-500/10 text-green-600">
                            <Globe className="w-3 h-3" />
                            Publik
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-gray-500/10 text-gray-500">
                            <Lock className="w-3 h-3" />
                            Privat
                        </span>
                    )}
                </div>

                {/* Members */}
                <div className="col-span-1">
                    <span className="inline-flex items-center gap-1 text-sm text-text-secondary">
                        <Users className="w-4 h-4" />
                        {league.memberCount}
                    </span>
                </div>

                {/* Created & Actions */}
                <div className="col-span-2 flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{formatDate(league.createdAt)}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onRecalculate(); }}
                        disabled={isRecalculating}
                        className="p-1.5 rounded-lg text-text-tertiary hover:text-brand-500 hover:bg-brand-500/10 transition-colors"
                        title="Räkna om ställning"
                    >
                        {isRecalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

interface MembersModalProps {
    league: AdminLeagueListDto
    members: AdminLeagueMemberDto[]
    isLoading: boolean
    onClose: () => void
    onRemoveMember: (userId: string) => void
    isRemoving: boolean
    formatDate: (date: string) => string
}

function MembersModal({ league, members, isLoading, onClose, onRemoveMember, isRemoving, formatDate }: MembersModalProps) {
    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] bg-bg-surface rounded-2xl border border-border-subtle shadow-2xl z-50 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="p-4 border-b border-border-subtle flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">{league.name}</h2>
                        <p className="text-sm text-text-secondary">{members.length} medlemmar</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-bg-subtle transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Members List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <Loader2 className="w-8 h-8 mx-auto animate-spin text-brand-500" />
                            <p className="mt-2 text-text-secondary">Laddar medlemmar...</p>
                        </div>
                    ) : members.length === 0 ? (
                        <div className="p-8 text-center text-text-tertiary">
                            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>Inga medlemmar</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border-subtle">
                            {members.sort((a, b) => a.rank - b.rank).map((member) => (
                                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-bg-subtle/50">
                                    <div className="flex items-center gap-3">
                                        {/* Rank */}
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${member.rank === 1 ? 'bg-amber-500/10 text-amber-500' :
                                                member.rank === 2 ? 'bg-gray-400/10 text-gray-400' :
                                                    member.rank === 3 ? 'bg-orange-400/10 text-orange-400' :
                                                        'bg-bg-subtle text-text-tertiary'
                                            }`}>
                                            {member.rank}
                                        </div>

                                        <UserAvatar
                                            user={{
                                                username: member.displayName || member.username,
                                                avatarUrl: member.avatarUrl,
                                                email: member.email
                                            }}
                                            className="w-10 h-10"
                                        />

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-text-primary">
                                                    {member.displayName || member.username || 'Okänd'}
                                                </span>
                                                {member.isAdmin && (
                                                    <Crown className="w-4 h-4 text-amber-500" />
                                                )}
                                            </div>
                                            <p className="text-xs text-text-tertiary">
                                                Gick med {formatDate(member.joinedAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="text-lg font-bold text-text-primary">
                                            {member.totalPoints} <span className="text-xs font-normal text-text-tertiary">poäng</span>
                                        </span>

                                        {!league.isGlobal && (
                                            <button
                                                onClick={() => onRemoveMember(member.userId)}
                                                disabled={isRemoving}
                                                className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                                title="Ta bort från liga"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    )
}
