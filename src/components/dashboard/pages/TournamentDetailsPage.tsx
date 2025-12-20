import { useState } from "react"
import { useParams } from "react-router-dom"
import { useMatches, useTournaments, useTournamentTeams } from "@/hooks/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Users, Trophy, Calendar, LayoutGrid, List, Sparkles } from "lucide-react"
import { MatchStatus } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

import type { MatchDto } from "@/lib/api"
import { type TeamStats } from "@/components/standings/StandingsTable"
import { GroupStageLayout } from "@/components/dashboard/components/GroupStageLayout"
import { PlayoffBracket } from "../components/PlayoffBracket"

function TournamentSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-48 rounded-2xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
            </div>
        </div>
    )
}

export function TournamentDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const { data: tournaments } = useTournaments()
    const tournament = tournaments?.find(t => t.id === id)
    const { data: teams, isLoading: isLoadingTeams } = useTournamentTeams(id!)
    const { data: matches, isLoading: isLoadingMatches } = useMatches(id)

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const isLoading = isLoadingMatches && isLoadingTeams && !tournament

    if (isLoading) return <TournamentSkeleton />

    // --- Matches Logic ---
    const groupMatches = matches?.filter(m => m.stage === 0) || []
    const groups: Record<string, MatchDto[]> = {}
    groupMatches.forEach(match => {
        const groupName = match.groupName || "Matcher"
        if (!groups[groupName]) groups[groupName] = []
        groups[groupName].push(match)
    })
    const sortedGroupNames = Object.keys(groups).sort()

    const calculateStandings = (matches: MatchDto[]) => {
        const stats: Record<string, TeamStats> = {}
        const ensureTeam = (id: string, name: string, logo: string | null) => {
            if (!stats[id]) {
                stats[id] = { id, name, logoUrl: logo, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
            }
        }

        matches.forEach(m => {
            const homeId = m.homeTeamId || `temp-home-${m.id}`
            const awayId = m.awayTeamId || `temp-away-${m.id}`
            ensureTeam(homeId, m.homeTeamName || 'Home', m.homeTeamLogoUrl)
            ensureTeam(awayId, m.awayTeamName || 'Away', m.awayTeamLogoUrl)

            if (m.status === MatchStatus.Finished || (m.homeScore !== null && m.awayScore !== null)) {
                const home = stats[homeId]
                const away = stats[awayId]
                const hScore = m.homeScore ?? 0
                const aScore = m.awayScore ?? 0

                home.mp++
                away.mp++
                home.gf += hScore
                home.ga += aScore
                away.gf += aScore
                away.ga += hScore

                if (hScore > aScore) { home.w++; home.pts += 3; away.l++ }
                else if (hScore < aScore) { away.w++; away.pts += 3; home.l++ }
                else { home.d++; home.pts += 1; away.d++; away.pts += 1 }
            }
        })

        return Object.values(stats).sort((a, b) => {
            if (b.pts !== a.pts) return b.pts - a.pts
            const gdA = a.gf - a.ga
            const gdB = b.gf - b.ga
            if (gdB !== gdA) return gdB - gdA
            return b.gf - a.gf
        })
    }

    const standings = calculateStandings(groupMatches)
    const sortedTeams = teams ? [...teams].sort((a, b) => (a.fifaRank ?? 999) - (b.fifaRank ?? 999)) : []
    const groupNames = Array.from(new Set(sortedTeams.map(t => t.groupName).filter(Boolean))).sort()

    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Hero Header */}
            <motion.div
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-8 text-white shadow-xl shadow-brand-500/25"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                        backgroundSize: '20px 20px'
                    }}
                />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                    {tournament?.logoUrl && (
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex items-center justify-center shrink-0">
                            <img src={tournament.logoUrl} alt="" className="w-full h-full object-contain" />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-brand-200" />
                            <span className="text-sm font-medium text-brand-200">Turnering</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{tournament?.name || 'Turnering'}</h1>
                        <p className="text-brand-100 mt-2 max-w-lg">
                            Följ turneringen, se statistik och tippa matcher.
                        </p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="relative z-10 mt-6 pt-6 border-t border-white/20 grid grid-cols-3 gap-6">
                    {[
                        { icon: Users, value: sortedTeams.length, label: 'Lag' },
                        { icon: Trophy, value: groupNames.length, label: 'Grupper' },
                        { icon: Calendar, value: matches?.length || 0, label: 'Matcher' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <stat.icon className="w-5 h-5 mx-auto mb-1 text-brand-200" />
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-xs text-brand-200">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <Tabs defaultValue="teams" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="teams">Deltagande Lag</TabsTrigger>
                    <TabsTrigger value="matches">Matcher</TabsTrigger>
                </TabsList>

                {/* Teams Tab */}
                <TabsContent value="teams" className="mt-6">
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* View Toggle */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-text-primary">{sortedTeams.length} Deltagande Lag</h2>
                            <div className="flex items-center gap-1 bg-bg-subtle p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-bg-surface shadow-sm text-text-primary' : 'text-text-tertiary hover:text-text-primary'}`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-bg-surface shadow-sm text-text-primary' : 'text-text-tertiary hover:text-text-primary'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {viewMode === 'grid' ? (
                            // Premium Grid View - Teams organized by group
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {groupNames.map((groupName, groupIndex) => (
                                    <motion.div
                                        key={groupName}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + groupIndex * 0.05 }}
                                    >
                                        <Card className="overflow-hidden border-border-subtle hover:shadow-lg transition-shadow">
                                            <div className="bg-gradient-to-r from-brand-500/10 to-brand-600/5 border-b border-border-subtle px-4 py-3">
                                                <h3 className="font-bold text-text-primary flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-brand-500" />
                                                    Grupp {groupName}
                                                </h3>
                                            </div>
                                            <CardContent className="p-0">
                                                <div className="divide-y divide-border-subtle">
                                                    {sortedTeams.filter(t => t.groupName === groupName).map((team, i) => (
                                                        <motion.div
                                                            key={team.id}
                                                            className="flex items-center gap-3 p-3 hover:bg-bg-subtle/50 transition-colors group"
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.2 + i * 0.03 }}
                                                        >
                                                            <div className="w-8 h-6 rounded overflow-hidden border border-border-subtle shadow-sm shrink-0">
                                                                {team.flagUrl ? (
                                                                    <img src={team.flagUrl} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full bg-bg-subtle flex items-center justify-center text-2xs font-bold text-text-tertiary">
                                                                        {team.code}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-sm text-text-primary truncate group-hover:text-brand-600 transition-colors">
                                                                    {team.name}
                                                                </p>
                                                            </div>
                                                            {team.fifaRank && (
                                                                <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${team.fifaRank === 1 ? 'bg-amber-100 text-amber-700' :
                                                                    team.fifaRank <= 3 ? 'bg-slate-100 text-slate-700' :
                                                                        team.fifaRank <= 10 ? 'bg-brand-50 text-brand-700' :
                                                                            'bg-bg-subtle text-text-tertiary'
                                                                    }`}>
                                                                    #{team.fifaRank}
                                                                </span>
                                                            )}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            // List View - All teams in one clean table
                            <Card className="overflow-hidden border-border-subtle">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-bg-subtle/50 border-b border-border-subtle">
                                                <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Rank</th>
                                                <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Lag</th>
                                                <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Grupp</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border-subtle">
                                            {sortedTeams.map((team, i) => (
                                                <motion.tr
                                                    key={team.id}
                                                    className="hover:bg-bg-subtle/30 transition-colors"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.02 }}
                                                >
                                                    <td className="py-3 px-4">
                                                        <span className={`text-xs font-bold px-2 py-1 rounded ${team.fifaRank === 1 ? 'bg-amber-100 text-amber-700' :
                                                            team.fifaRank && team.fifaRank <= 3 ? 'bg-slate-100 text-slate-700' :
                                                                'bg-bg-subtle text-text-tertiary'
                                                            }`}>
                                                            #{team.fifaRank || '-'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-6 rounded overflow-hidden border border-border-subtle shadow-sm shrink-0">
                                                                {team.flagUrl ? (
                                                                    <img src={team.flagUrl} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full bg-bg-subtle flex items-center justify-center text-2xs font-bold text-text-tertiary">
                                                                        {team.code}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className="font-medium text-text-primary">{team.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-sm text-text-secondary bg-bg-subtle px-2 py-1 rounded">
                                                            Grupp {team.groupName || '-'}
                                                        </span>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        )}
                    </motion.div>
                </TabsContent>

                {/* Matches Tab */}
                <TabsContent value="matches" className="mt-6">
                    <Tabs defaultValue="groups" className="w-full">
                        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                            <TabsTrigger
                                value="groups"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:bg-transparent px-0 py-2 text-text-primary"
                            >
                                Gruppspel
                            </TabsTrigger>
                            <TabsTrigger
                                value="playoffs"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:bg-transparent px-0 py-2 text-text-primary"
                            >
                                Slutspel
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="groups" className="space-y-8 mt-6">
                            {sortedGroupNames.length === 0 && (
                                <p className="text-text-tertiary">Inga gruppspelsmatcher hittades.</p>
                            )}
                            <GroupStageLayout
                                groups={groups}
                                standings={standings}
                                mode="view"
                            />
                        </TabsContent>

                        <TabsContent value="playoffs">
                            <PlayoffBracket matches={matches || []} />
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </motion.div>
    )
}
