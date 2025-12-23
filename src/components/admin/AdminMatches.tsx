import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Calendar, Search, Check, X, Loader2, RefreshCw, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, MatchStatus, MatchStage } from '@/lib/api'
import type { MatchDto } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'

// Status labels
const statusLabels: Record<number, { label: string; color: string }> = {
    [MatchStatus.Scheduled]: { label: 'Planerad', color: 'text-blue-500 bg-blue-500/10' },
    [MatchStatus.InProgress]: { label: 'Pågår', color: 'text-green-500 bg-green-500/10' },
    [MatchStatus.Finished]: { label: 'Avslutad', color: 'text-text-tertiary bg-bg-subtle' },
    [MatchStatus.Postponed]: { label: 'Uppskjuten', color: 'text-amber-500 bg-amber-500/10' },
    [MatchStatus.Cancelled]: { label: 'Inställd', color: 'text-red-500 bg-red-500/10' },
}

const stageLabels: Record<number, string> = {
    [MatchStage.Group]: 'Gruppspel',
    [MatchStage.RoundOf16]: 'Åttondelsfinaler',
    [MatchStage.QuarterFinal]: 'Kvartsfinaler',
    [MatchStage.SemiFinal]: 'Semifinaler',
    [MatchStage.Final]: 'Final',
}

interface EditingMatch {
    id: string
    homeScore: string
    awayScore: string
    status: number
}

export function AdminMatches() {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [selectedTournamentId, setSelectedTournamentId] = useState<string>('')
    const [editingMatch, setEditingMatch] = useState<EditingMatch | null>(null)
    const { token } = useAuth()
    const queryClient = useQueryClient()

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Fetch tournaments for dropdown
    const { data: tournaments, isLoading: tournamentsLoading } = useQuery({
        queryKey: ['tournaments'],
        queryFn: () => api.tournaments.list(token!, false),
        enabled: !!token,
    })

    // Auto-select active tournament when loaded
    useEffect(() => {
        if (tournaments && tournaments.length > 0 && !selectedTournamentId) {
            const activeTournament = tournaments.find(t => t.isActive)
            setSelectedTournamentId(activeTournament?.id || tournaments[0].id)
        }
    }, [tournaments, selectedTournamentId])

    // Fetch matches for selected tournament
    const { data: matches, isLoading: matchesLoading, error } = useQuery({
        queryKey: ['matches', selectedTournamentId],
        queryFn: () => api.matches.list(token!, selectedTournamentId),
        enabled: !!token && !!selectedTournamentId,
    })

    // Update result mutation
    const updateResultMutation = useMutation({
        mutationFn: ({ matchId, homeScore, awayScore, status }: { matchId: string; homeScore: number | null; awayScore: number | null; status: number }) =>
            api.admin.matches.updateResult(token!, matchId, { homeScore, awayScore, status: status as typeof MatchStatus[keyof typeof MatchStatus] }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches'] })
            setEditingMatch(null)
        }
    })

    // Recalculate match points
    const recalculateMutation = useMutation({
        mutationFn: (matchId: string) => api.admin.matches.recalculate(token!, matchId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['matches'] })
            alert(`Uppdaterade ${data.predictionsUpdated} predictions i ${data.leaguesAffected} ligor`)
        }
    })

    // Filter matches by search
    const filteredMatches = useMemo(() => {
        if (!matches) return []
        if (!debouncedSearch) return matches

        const search = debouncedSearch.toLowerCase()
        return matches.filter(match =>
            match.homeTeamName?.toLowerCase().includes(search) ||
            match.awayTeamName?.toLowerCase().includes(search) ||
            match.venue?.toLowerCase().includes(search)
        )
    }, [matches, debouncedSearch])

    // Group by date
    const matchesByDate = useMemo(() => {
        const grouped = new Map<string, MatchDto[]>()
        filteredMatches.forEach(match => {
            const date = format(new Date(match.matchDate), 'yyyy-MM-dd')
            if (!grouped.has(date)) grouped.set(date, [])
            grouped.get(date)!.push(match)
        })
        // Sort by date descending (most recent first)
        return Array.from(grouped.entries()).sort((a, b) => b[0].localeCompare(a[0]))
    }, [filteredMatches])

    const startEditing = (match: MatchDto) => {
        setEditingMatch({
            id: match.id,
            homeScore: match.homeScore?.toString() ?? '',
            awayScore: match.awayScore?.toString() ?? '',
            status: match.status
        })
    }

    const saveResult = () => {
        if (!editingMatch) return
        updateResultMutation.mutate({
            matchId: editingMatch.id,
            homeScore: editingMatch.homeScore !== '' ? parseInt(editingMatch.homeScore) : null,
            awayScore: editingMatch.awayScore !== '' ? parseInt(editingMatch.awayScore) : null,
            status: editingMatch.status
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Matcher</h1>
                    <p className="text-text-secondary">
                        {matches ? `${matches.length} matcher` : 'Hantera matchresultat'}
                    </p>
                </div>
            </div>

            {/* Tournament Selector */}
            <Card className="p-4 bg-bg-surface border-border-subtle">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Tournament Dropdown */}
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-text-tertiary mb-2">Välj turnering</label>
                        <div className="relative">
                            <select
                                value={selectedTournamentId}
                                onChange={(e) => setSelectedTournamentId(e.target.value)}
                                disabled={tournamentsLoading}
                                className="w-full appearance-none bg-bg-subtle border border-border-subtle rounded-lg px-4 py-2.5 pr-10 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                            >
                                {tournamentsLoading ? (
                                    <option>Laddar turneringar...</option>
                                ) : tournaments?.length === 0 ? (
                                    <option>Inga turneringar</option>
                                ) : (
                                    tournaments?.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} {t.isActive ? '(Aktiv)' : ''}
                                        </option>
                                    ))
                                )}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                        </div>
                    </div>

                    {/* Search */}
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-text-tertiary mb-2">Sök match</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                            <Input
                                placeholder="Sök efter lag eller arena..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-bg-subtle border-border-subtle"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Matches List */}
            {!selectedTournamentId ? (
                <Card className="p-8 bg-bg-surface border-border-subtle">
                    <div className="text-center text-text-tertiary">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium text-text-secondary">Välj en turnering</p>
                        <p className="text-sm mt-1">Välj turnering ovan för att visa matcher</p>
                    </div>
                </Card>
            ) : matchesLoading ? (
                <Card className="p-8 bg-bg-surface border-border-subtle">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-brand-500" />
                        <p className="mt-2 text-text-secondary">Laddar matcher...</p>
                    </div>
                </Card>
            ) : error ? (
                <Card className="p-8 bg-bg-surface border-border-subtle">
                    <div className="text-center text-red-500">
                        <p>Kunde inte ladda matcher</p>
                        <p className="text-sm mt-1 text-text-secondary">{(error as Error).message}</p>
                    </div>
                </Card>
            ) : matchesByDate.length === 0 ? (
                <Card className="p-8 bg-bg-surface border-border-subtle">
                    <div className="text-center text-text-tertiary">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium text-text-secondary">Inga matcher hittades</p>
                    </div>
                </Card>
            ) : (
                matchesByDate.map(([date, dateMatches]) => (
                    <Card key={date} className="bg-bg-surface border-border-subtle overflow-hidden">
                        <div className="px-4 py-3 bg-bg-subtle/50 border-b border-border-subtle">
                            <h3 className="font-semibold text-text-primary">
                                {format(new Date(date), 'EEEE d MMMM yyyy', { locale: sv })}
                            </h3>
                        </div>
                        <div className="divide-y divide-border-subtle">
                            {dateMatches.map((match) => (
                                <div key={match.id} className="p-4 hover:bg-bg-subtle/30 transition-colors">
                                    <div className="flex items-center justify-between gap-4">
                                        {/* Match Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-4">
                                                {/* Home Team */}
                                                <div className="flex items-center gap-2 flex-1 justify-end">
                                                    <span className="font-medium text-text-primary truncate">
                                                        {match.homeTeamName}
                                                    </span>
                                                    {match.homeTeamLogoUrl && (
                                                        <img
                                                            src={match.homeTeamLogoUrl}
                                                            alt=""
                                                            className="w-6 h-4 object-contain"
                                                        />
                                                    )}
                                                </div>

                                                {/* Score / Edit */}
                                                <div className="flex items-center gap-2 min-w-[280px] justify-center">
                                                    {editingMatch?.id === match.id ? (
                                                        <>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                value={editingMatch.homeScore}
                                                                onChange={(e) => setEditingMatch({ ...editingMatch, homeScore: e.target.value })}
                                                                className="w-12 h-8 text-center p-1 bg-bg-subtle"
                                                            />
                                                            <span className="text-text-tertiary">-</span>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                value={editingMatch.awayScore}
                                                                onChange={(e) => setEditingMatch({ ...editingMatch, awayScore: e.target.value })}
                                                                className="w-12 h-8 text-center p-1 bg-bg-subtle"
                                                            />
                                                            <select
                                                                value={editingMatch.status}
                                                                onChange={(e) => setEditingMatch({ ...editingMatch, status: parseInt(e.target.value) })}
                                                                className="h-8 px-2 text-xs rounded-lg bg-bg-subtle border border-border-subtle text-text-primary"
                                                            >
                                                                <option value={0}>Planerad</option>
                                                                <option value={1}>Pågår</option>
                                                                <option value={2}>Avslutad</option>
                                                                <option value={3}>Uppskjuten</option>
                                                                <option value={4}>Inställd</option>
                                                            </select>
                                                            <button
                                                                onClick={saveResult}
                                                                disabled={updateResultMutation.isPending}
                                                                className="p-1 text-green-500 hover:bg-green-500/10 rounded"
                                                            >
                                                                {updateResultMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingMatch(null)}
                                                                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => startEditing(match)}
                                                            className="px-3 py-1 rounded-lg bg-bg-subtle hover:bg-border-subtle transition-colors font-mono text-lg"
                                                        >
                                                            {match.homeScore !== null && match.awayScore !== null
                                                                ? `${match.homeScore} - ${match.awayScore}`
                                                                : '- : -'
                                                            }
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Away Team */}
                                                <div className="flex items-center gap-2 flex-1">
                                                    {match.awayTeamLogoUrl && (
                                                        <img
                                                            src={match.awayTeamLogoUrl}
                                                            alt=""
                                                            className="w-6 h-4 object-contain"
                                                        />
                                                    )}
                                                    <span className="font-medium text-text-primary truncate">
                                                        {match.awayTeamName}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Meta */}
                                            <div className="flex items-center gap-4 mt-2 text-xs text-text-tertiary">
                                                <span>{stageLabels[match.stage] || 'Okänd fas'}</span>
                                                {match.groupName && <span>Grupp {match.groupName}</span>}
                                                {match.venue && <span>{match.venue.split(',')[0]}</span>}
                                            </div>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusLabels[match.status]?.color || ''}`}>
                                                {statusLabels[match.status]?.label || 'Okänd'}
                                            </span>
                                            {match.status === MatchStatus.Finished && (
                                                <button
                                                    onClick={() => recalculateMutation.mutate(match.id)}
                                                    disabled={recalculateMutation.isPending}
                                                    className="p-1.5 rounded-lg text-text-tertiary hover:text-brand-500 hover:bg-brand-500/10 transition-colors"
                                                    title="Räkna om poäng"
                                                >
                                                    {recalculateMutation.isPending ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <RefreshCw className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))
            )}
        </motion.div>
    )
}
