import { useState } from "react"
import { useParams } from "react-router-dom"
import { useMatches, useTournaments, useTournamentTeams } from "@/hooks/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MapPin } from "lucide-react"
import { MatchStatus } from "@/lib/api"
import type { MatchDto } from "@/lib/api"


export function TournamentDetailsPage() {
    const { id } = useParams<{ id: string }>()
    // Fetch tournament info
    const { data: tournaments } = useTournaments()
    const tournament = tournaments?.find(t => t.id === id)

    // Fetch teams
    const { data: teams, isLoading: isLoadingTeams } = useTournamentTeams(id!)

    // Fetch all matches for this tournament
    const { data: matches, isLoading: isLoadingMatches } = useMatches(id)

    const [viewMode, setViewMode] = useState<'ranking' | 'groups'>('ranking')

    const isLoading = isLoadingMatches && isLoadingTeams && !tournament

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // --- Matches Logic ---
    const groupMatches = matches?.filter(m => m.stage === 0) || []
    const groups: Record<string, MatchDto[]> = {}
    groupMatches.forEach(match => {
        const groupName = match.groupName || "Matcher"
        if (!groups[groupName]) groups[groupName] = []
        groups[groupName].push(match)
    })
    const sortedGroupNames = Object.keys(groups).sort()

    // --- Standings Calculation Logic ---
    type TeamStats = {
        id: string;
        name: string;
        logoUrl: string | null;
        mp: number;
        w: number;
        d: number;
        l: number;
        gf: number;
        ga: number;
        pts: number;
    }

    const calculateStandings = (matches: MatchDto[]) => {
        const stats: Record<string, TeamStats> = {}

        const ensureTeam = (id: string, name: string, logo: string | null) => {
            if (!stats[id]) {
                stats[id] = { id, name, logoUrl: logo, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
            }
        }

        matches.forEach(m => {
            const homeId = m.homeTeamId || `temp-home-${m.id}`;
            const awayId = m.awayTeamId || `temp-away-${m.id}`;

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

                if (hScore > aScore) {
                    home.w++
                    home.pts += 3
                    away.l++
                } else if (hScore < aScore) {
                    away.w++
                    away.pts += 3
                    home.l++
                } else {
                    home.d++
                    home.pts += 1
                    away.d++
                    away.pts += 1
                }
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

    const sortedTeams = teams ? [...teams].sort((a, b) => (a.fifaRank ?? 999) - (b.fifaRank ?? 999)) : []

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{tournament?.name || 'Turnering'}</h1>
                <p className="text-muted-foreground">Följ turneringen, se statistik och tippa matcher.</p>
            </div>

            <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="info">Information</TabsTrigger>
                    <TabsTrigger value="matches">Matcher</TabsTrigger>
                </TabsList>

                {/* --- Information Tab --- */}
                <TabsContent value="info" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Om Turneringen</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {tournament?.logoUrl && (
                                    <div className="w-32 h-32 shrink-0 bg-muted/10 rounded-xl overflow-hidden p-4 border flex items-center justify-center">
                                        <img src={tournament.logoUrl} alt={tournament.name || ''} className="w-full h-full object-contain" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Välkommen till {tournament?.name}! Här samlas världens bästa lag för att göra upp om titeln.
                                        Följ spänningen, resultaten och se hur det går för dina favoriter.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                            <h2 className="text-xl font-semibold tracking-tight">Deltagande Lag</h2>
                            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('ranking')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'ranking' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground/80'}`}
                                >
                                    Ranking
                                </button>
                                <button
                                    onClick={() => setViewMode('groups')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'groups' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground/80'}`}
                                >
                                    Grupper
                                </button>
                            </div>
                        </div>

                        {viewMode === 'ranking' ? (
                            <Card className="w-fit mx-auto min-w-[350px] border-muted/60 shadow-sm">
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-auto text-left text-sm">
                                            <thead>
                                                <tr className="border-b bg-muted/30 text-muted-foreground">
                                                    <th className="py-2 px-4 font-medium whitespace-nowrap">Lag</th>
                                                    <th className="py-2 px-4 font-medium text-right whitespace-nowrap text-muted-foreground/70">Grupp</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {sortedTeams.map(team => {
                                                    let badgeClass = "bg-muted text-muted-foreground border-transparent"
                                                    if (team.fifaRank === 1) badgeClass = "bg-yellow-100 text-yellow-700 border-yellow-200/50"
                                                    else if (team.fifaRank === 2) badgeClass = "bg-slate-100 text-slate-700 border-slate-200/50"
                                                    else if (team.fifaRank === 3) badgeClass = "bg-orange-100 text-orange-800 border-orange-200/50"

                                                    return (
                                                        <tr key={team.id} className="hover:bg-muted/30 transition-colors group">
                                                            <td className="py-2.5 px-4 pr-12">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-6 flex-shrink-0 relative flex items-center justify-center bg-muted/10 rounded-sm overflow-hidden border shadow-sm">
                                                                        {team.flagUrl ? (
                                                                            <img src={team.flagUrl} alt="" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <span className="text-[10px] font-bold">{team.code}</span>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium text-foreground">{team.name}</span>

                                                                        {team.fifaRank && (
                                                                            <div className="group/tooltip relative inline-flex ml-1">
                                                                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badgeClass} cursor-help tabular-nums tracking-tight`}>
                                                                                    #{team.fifaRank}
                                                                                </span>
                                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg border hidden group-hover/tooltip:block z-50 whitespace-nowrap">
                                                                                    {team.name} är rankade {team.fifaRank}:a i världen
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-2.5 px-4 text-right">
                                                                {team.groupName ? (
                                                                    <span className="bg-muted/50 text-muted-foreground px-2 py-0.5 rounded text-xs font-medium">Grupp {team.groupName}</span>
                                                                ) : '-'}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                                {sortedTeams.length === 0 && !isLoadingTeams && (
                                                    <tr>
                                                        <td colSpan={2} className="p-8 text-center text-muted-foreground">
                                                            Inga lag hittades.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {Array.from(new Set(sortedTeams.map(t => t.groupName).filter(Boolean))).sort().map(groupName => (
                                    <Card key={groupName} className="border-muted/60 shadow-sm overflow-hidden">
                                        <div className="bg-muted/30 border-b px-4 py-2">
                                            <h3 className="font-semibold text-sm">Grupp {groupName}</h3>
                                        </div>
                                        <CardContent className="p-0">
                                            <table className="w-full text-sm">
                                                <tbody className="divide-y">
                                                    {sortedTeams.filter(t => t.groupName === groupName).map(team => (
                                                        <tr key={team.id} className="hover:bg-muted/10 transition-colors">
                                                            <td className="p-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-6 h-4 flex-shrink-0 relative flex items-center justify-center bg-muted/10 rounded-sm overflow-hidden border">
                                                                        {team.flagUrl ? (
                                                                            <img src={team.flagUrl} alt="" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <span className="text-[9px] font-bold">{team.code}</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium leading-none">{team.name}</span>
                                                                        {team.fifaRank && (
                                                                            <span className="text-[10px] text-muted-foreground mt-0.5">Rank #{team.fifaRank}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* --- Matches Tab --- */}
                <TabsContent value="matches" className="mt-6">
                    <Tabs defaultValue="groups" className="w-full">
                        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                            <TabsTrigger
                                value="groups"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
                            >
                                Gruppspel
                            </TabsTrigger>
                            <TabsTrigger
                                value="playoffs"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
                            >
                                Slutspel
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="groups" className="space-y-8 mt-6">
                            {sortedGroupNames.length === 0 && (
                                <p className="text-muted-foreground">Inga gruppspelsmatcher hittades.</p>
                            )}

                            {sortedGroupNames.map(groupName => {
                                const groupMatchesList = groups[groupName]
                                const standings = calculateStandings(groupMatchesList)

                                return (
                                    <Card key={groupName} className="overflow-hidden">
                                        <CardHeader className="bg-muted/30 pb-4 border-b">
                                            <CardTitle>{groupName.startsWith('Group') ? groupName : `Grupp ${groupName}`}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x">

                                                {/* Left Column: Matches */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-y-auto max-h-[600px]">
                                                    {groupMatchesList.map(match => (
                                                        <div key={match.id} className="flex flex-col justify-between p-3 bg-muted/10 rounded-lg border hover:bg-muted/20 transition-colors text-sm min-h-[90px] gap-2">
                                                            {/* Top Row: Teams & Score */}
                                                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                                                                {/* Home Team */}
                                                                <div className="flex items-center justify-end gap-2 text-right">
                                                                    <span className="font-semibold hidden sm:inline truncate text-xs">{match.homeTeamName || 'Home'}</span>
                                                                    <span className="font-semibold sm:hidden text-xs">{match.homeTeamName?.substring(0, 3).toUpperCase() || 'HOM'}</span>
                                                                    {match.homeTeamLogoUrl ? (
                                                                        <img src={match.homeTeamLogoUrl} alt={match.homeTeamName || ''} className="w-5 h-5 object-contain" />
                                                                    ) : (
                                                                        <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center text-[8px] ring-1 ring-border">H</div>
                                                                    )}
                                                                </div>

                                                                {/* Center: Score */}
                                                                <div className="flex items-center justify-center min-w-[40px]">
                                                                    {(match.status === MatchStatus.InProgress || match.status === MatchStatus.Finished) && (
                                                                        <div className="font-bold font-mono bg-muted/50 px-2 py-0.5 rounded text-xs border whitespace-nowrap">
                                                                            {match.homeScore ?? 0} - {match.awayScore ?? 0}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Away Team */}
                                                                <div className="flex items-center justify-start gap-2 text-left">
                                                                    {match.awayTeamLogoUrl ? (
                                                                        <img src={match.awayTeamLogoUrl} alt={match.awayTeamName || ''} className="w-5 h-5 object-contain" />
                                                                    ) : (
                                                                        <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center text-[8px] ring-1 ring-border">A</div>
                                                                    )}
                                                                    <span className="font-semibold hidden sm:inline truncate text-xs">{match.awayTeamName || 'Away'}</span>
                                                                    <span className="font-semibold sm:hidden text-xs">{match.awayTeamName?.substring(0, 3).toUpperCase() || 'AWY'}</span>
                                                                </div>
                                                            </div>

                                                            {/* Bottom Row: Info (Date | Time | Venue) */}
                                                            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/60 border-t pt-2 mt-auto">
                                                                <div className="flex items-center gap-1">
                                                                    <span>{new Date(match.matchDate).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' })}</span>
                                                                    <span className="opacity-50">|</span>
                                                                    <span>{new Date(match.matchDate).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</span>
                                                                </div>
                                                                {match.venue && (
                                                                    <>
                                                                        <span className="opacity-50">|</span>
                                                                        <div className="flex items-start gap-1 max-w-[150px] text-left">
                                                                            <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                                                                            <div className="flex flex-col leading-none gap-0.5">
                                                                                <span className="truncate font-medium">{match.venue.split(',')[0].trim()}</span>
                                                                                {match.venue.split(',')[1] && (
                                                                                    <span className="truncate text-muted-foreground text-[9px]">{match.venue.split(',')[1].trim()}</span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Right Column: Standings Table */}
                                                <div className="p-4 bg-muted/5 text-sm overflow-x-auto">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead>
                                                            <tr className="border-b text-muted-foreground text-xs uppercase tracking-wider">
                                                                <th className="pb-2 pl-2 font-medium w-6">#</th>
                                                                <th className="pb-2 pl-2 font-medium">Lag</th>
                                                                <th className="pb-2 text-center font-medium" title="Matcher Spelade">M</th>
                                                                <th className="pb-2 text-center font-medium" title="Vunna">V</th>
                                                                <th className="pb-2 text-center font-medium" title="Oavgjorda">O</th>
                                                                <th className="pb-2 text-center font-medium" title="Förlorade">F</th>
                                                                <th className="pb-2 text-center font-medium" title="Målskillnad">+/-</th>
                                                                <th className="pb-2 text-right pr-2 font-bold" title="Poäng">P</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y relative">
                                                            {standings.map((team, idx) => {
                                                                const totalTeams = standings.length

                                                                // Qualification Logic: Left Border
                                                                let rowClass = "hover:bg-muted/30 relative"
                                                                let indicatorConfig = "border-l-4"

                                                                if (idx === 0 || idx === 1) {
                                                                    // 1st and 2nd place - green (always)
                                                                    indicatorConfig = "border-l-4 border-green-500"
                                                                } else if (idx === 2) {
                                                                    // 3rd place - blue (always)
                                                                    indicatorConfig = "border-l-4 border-blue-500"
                                                                } else {
                                                                    // 4th place or more - no border
                                                                    indicatorConfig = "border-l-4 border-transparent"
                                                                }

                                                                // Zone Separators: Apply colored border-top to the row AFTER the separator
                                                                let separatorClass = ""

                                                                // Keep gray line ABOVE 2nd place (idx 1) - explicit gray
                                                                if (idx === 1) {
                                                                    separatorClass = "!border-t-border"
                                                                }
                                                                // Green line ABOVE 3rd place (idx 2)
                                                                else if (idx === 2) {
                                                                    separatorClass = "!border-t-green-500"
                                                                }
                                                                // Blue line ABOVE 4th place (idx 3) - only if 4 teams
                                                                else if (idx === 3 && totalTeams > 3) {
                                                                    separatorClass = "!border-t-blue-500"
                                                                }

                                                                return (
                                                                    <tr key={team.id} className={`${rowClass} ${indicatorConfig} ${separatorClass}`}>
                                                                        <td className="py-2 pl-2 text-xs text-muted-foreground w-6">{idx + 1}</td>
                                                                        <td className="py-2 pl-2 flex items-center gap-2">
                                                                            {team.logoUrl && <img src={team.logoUrl} className="w-5 h-5 object-contain" alt="" />}
                                                                            <span className="font-medium truncate max-w-[100px] sm:max-w-[150px]">{team.name}</span>
                                                                        </td>
                                                                        <td className="py-2 text-center">{team.mp}</td>
                                                                        <td className="py-2 text-center text-muted-foreground">{team.w}</td>
                                                                        <td className="py-2 text-center text-muted-foreground">{team.d}</td>
                                                                        <td className="py-2 text-center text-muted-foreground">{team.l}</td>
                                                                        <td className="py-2 text-center text-muted-foreground">
                                                                            {team.gf - team.ga > 0 ? '+' : ''}{team.gf - team.ga}
                                                                        </td>
                                                                        <td className="py-2 text-right pr-2 font-bold">{team.pts}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                    <div className="mt-4 flex gap-4 text-[10px] text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-1 h-3 bg-green-500"></div>
                                                            <span>Till Slutspel (1-2)</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-1 h-3 bg-blue-500"></div>
                                                            <span>Ranking 3:or</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </TabsContent>

                        <TabsContent value="playoffs">
                            <Card>
                                <CardContent className="p-8 text-center text-muted-foreground">
                                    Slutspelsträd kommer snart...
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </div>
    )
}
