import { Card } from '@/components/ui/card'
import { Trophy, Power, PowerOff, RefreshCw, Loader2, Calendar, Hash } from 'lucide-react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { TournamentDto } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'

export function AdminTournaments() {
    const { token } = useAuth()
    const queryClient = useQueryClient()

    // Fetch tournaments
    const { data: tournaments, isLoading, error } = useQuery({
        queryKey: ['tournaments'],
        queryFn: () => api.tournaments.list(token!, false), // Include inactive
        enabled: !!token,
    })

    // Activate tournament
    const activateMutation = useMutation({
        mutationFn: (tournamentId: string) => api.admin.tournaments.activate(token!, tournamentId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    })

    // Deactivate tournament
    const deactivateMutation = useMutation({
        mutationFn: (tournamentId: string) => api.admin.tournaments.deactivate(token!, tournamentId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    })

    // Recalculate standings
    const recalculateMutation = useMutation({
        mutationFn: (tournamentId: string) => api.admin.tournaments.recalculateStandings(token!, tournamentId),
        onSuccess: (data) => {
            alert(`Räknade om ställning för ${data.leaguesUpdated} ligor med ${data.totalMembersUpdated} medlemmar`)
            queryClient.invalidateQueries({ queryKey: ['tournaments'] })
        }
    })

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), 'd MMM yyyy', { locale: sv })
        } catch {
            return dateStr
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Turneringar</h1>
                    <p className="text-text-secondary">
                        {tournaments ? `${tournaments.length} turneringar` : 'Hantera turneringar'}
                    </p>
                </div>
            </div>

            {/* Tournaments List */}
            {isLoading ? (
                <Card className="p-8 bg-bg-surface border-border-subtle">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-brand-500" />
                        <p className="mt-2 text-text-secondary">Laddar turneringar...</p>
                    </div>
                </Card>
            ) : error ? (
                <Card className="p-8 bg-bg-surface border-border-subtle">
                    <div className="text-center text-red-500">
                        <p>Kunde inte ladda turneringar</p>
                        <p className="text-sm mt-1 text-text-secondary">{(error as Error).message}</p>
                    </div>
                </Card>
            ) : tournaments?.length === 0 ? (
                <Card className="p-8 bg-bg-surface border-border-subtle">
                    <div className="text-center text-text-tertiary">
                        <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium text-text-secondary">Inga turneringar hittades</p>
                    </div>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {tournaments?.map((tournament) => (
                        <TournamentCard
                            key={tournament.id}
                            tournament={tournament}
                            onActivate={() => activateMutation.mutate(tournament.id)}
                            onDeactivate={() => deactivateMutation.mutate(tournament.id)}
                            onRecalculate={() => recalculateMutation.mutate(tournament.id)}
                            isActivating={activateMutation.isPending}
                            isDeactivating={deactivateMutation.isPending}
                            isRecalculating={recalculateMutation.isPending}
                            formatDate={formatDate}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    )
}

interface TournamentCardProps {
    tournament: TournamentDto
    onActivate: () => void
    onDeactivate: () => void
    onRecalculate: () => void
    isActivating: boolean
    isDeactivating: boolean
    isRecalculating: boolean
    formatDate: (date: string) => string
}

function TournamentCard({
    tournament,
    onActivate,
    onDeactivate,
    onRecalculate,
    isActivating,
    isDeactivating,
    isRecalculating,
    formatDate
}: TournamentCardProps) {
    return (
        <Card className="bg-bg-surface border-border-subtle overflow-hidden">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    {tournament.logoUrl ? (
                        <img
                            src={tournament.logoUrl}
                            alt={tournament.name || 'Tournament'}
                            className="w-12 h-12 object-contain"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-amber-500" />
                        </div>
                    )}

                    {/* Info */}
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-text-primary">
                                {tournament.name || 'Okänd turnering'}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tournament.isActive
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-gray-500/10 text-gray-500'
                                }`}>
                                {tournament.isActive ? 'Aktiv' : 'Inaktiv'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-text-tertiary">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Hash className="w-3.5 h-3.5" />
                                {tournament.year}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Recalculate standings */}
                    <button
                        onClick={onRecalculate}
                        disabled={isRecalculating}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                        title="Räkna om ställning för alla ligor"
                    >
                        {isRecalculating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium hidden sm:inline">Räkna om</span>
                    </button>

                    {/* Toggle active status */}
                    {tournament.isActive ? (
                        <button
                            onClick={onDeactivate}
                            disabled={isDeactivating}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            title="Inaktivera turnering"
                        >
                            {isDeactivating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <PowerOff className="w-4 h-4" />
                            )}
                            <span className="text-sm font-medium hidden sm:inline">Inaktivera</span>
                        </button>
                    ) : (
                        <button
                            onClick={onActivate}
                            disabled={isActivating}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                            title="Aktivera turnering"
                        >
                            {isActivating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Power className="w-4 h-4" />
                            )}
                            <span className="text-sm font-medium hidden sm:inline">Aktivera</span>
                        </button>
                    )}
                </div>
            </div>
        </Card>
    )
}
