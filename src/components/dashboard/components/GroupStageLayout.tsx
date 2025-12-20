
import { MatchStatus, type MatchDto, type LeagueSettingsDto } from "@/lib/api"
import { StandingsTable, type TeamStats } from "@/components/dashboard/components/StandingsTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"


interface GroupStageLayoutProps {
    groups: Record<string, MatchDto[]>
    standings: TeamStats[]
    mode: 'view' | 'betting'
    predictionValues?: Record<string, { home: string, away: string }>
    onPredictionChange?: (matchId: string, type: 'home' | 'away', value: string) => void
    isSaving?: boolean
    leagueSettings?: LeagueSettingsDto
}

export function GroupStageLayout({
    groups,
    standings,
    mode,
    predictionValues,
    onPredictionChange,
    isSaving,
    leagueSettings
}: GroupStageLayoutProps) {
    return (
        <div className="space-y-8">
            {Object.entries(groups).map(([groupName, groupMatches]) => {
                // Filter standings for this group
                const groupTeamIds = new Set<string>()
                groupMatches.forEach(m => {
                    groupTeamIds.add(m.homeTeamId)
                    groupTeamIds.add(m.awayTeamId)
                })
                const groupStandings = standings.filter(t => groupTeamIds.has(t.id))

                return (
                    <Card key={groupName} className="overflow-hidden">
                        <CardHeader className="bg-muted/5 py-3 border-b">
                            <CardTitle className="text-sm font-medium">Grupp {groupName}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x">

                                {/* Left Column: Matches */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-y-auto max-h-[600px]">
                                    {groupMatches.map(match => {
                                        const now = new Date()
                                        const matchDate = new Date(match.matchDate)

                                        // Status checks
                                        const isFinished = match.status === MatchStatus.Finished
                                        const isLive = match.status === MatchStatus.InProgress || (matchDate <= now && !isFinished && match.status !== MatchStatus.Scheduled)
                                        // Note: Scheduled is default. If date passed and not Finished/InProgress/Postponed/Cancelled, arguably it's InProgress or just "Live" by time.
                                        // User said: "live då är den låst för o predicta och har någon label live".
                                        // If matchDate <= now and status is still Scheduled, we should treat as Live/Locked usually.

                                        // Locking logic based on settings
                                        let isLocked = false
                                        if (mode === 'betting' && leagueSettings) {
                                            const deadlineMinutes = leagueSettings.deadlineMinutes || 0

                                            if (leagueSettings.predictionMode === 'AllAtOnce') {
                                                const lockTime = new Date(matchDate.getTime() - deadlineMinutes * 60000)
                                                if (now > lockTime && !leagueSettings.allowLateEdits) isLocked = true
                                            } else {
                                                // Per Match
                                                const lockTime = new Date(matchDate.getTime() - deadlineMinutes * 60000)
                                                if (now > lockTime && !leagueSettings.allowLateEdits) isLocked = true
                                            }
                                        }

                                        // Always lock if started or finished
                                        if (matchDate <= now || isFinished || match.status === MatchStatus.InProgress) isLocked = true

                                        const scores = predictionValues?.[match.id] || { home: '', away: '' }

                                        // Feedback Logic (Green/Red)
                                        let homeClass = ""
                                        let awayClass = ""
                                        if (isFinished && scores.home !== '' && scores.away !== '' && match.homeScore !== null && match.awayScore !== null) {
                                            const predHome = parseInt(scores.home)
                                            const predAway = parseInt(scores.away)
                                            const actualHome = match.homeScore
                                            const actualAway = match.awayScore

                                            // Exact score
                                            if (predHome === actualHome && predAway === actualAway) {
                                                homeClass = "bg-green-100 border-green-500 text-green-900"
                                                awayClass = "bg-green-100 border-green-500 text-green-900"
                                            } else {
                                                // Correct outcome
                                                const predOutcome = predHome > predAway ? '1' : predHome < predAway ? '2' : 'x'
                                                const actualOutcome = actualHome > actualAway ? '1' : actualAway < actualHome ? '2' : 'x'

                                                if (predOutcome === actualOutcome) {
                                                    // Partial correct (outcome)
                                                    homeClass = "bg-yellow-50 border-yellow-400 text-yellow-900"
                                                    awayClass = "bg-yellow-50 border-yellow-400 text-yellow-900"
                                                } else {
                                                    // Wrong
                                                    homeClass = "bg-red-50 border-red-300 text-red-900 opacity-70"
                                                    awayClass = "bg-red-50 border-red-300 text-red-900 opacity-70"
                                                }
                                            }
                                        }

                                        return (
                                            <div key={match.id} className="flex flex-col p-4 bg-background relative border rounded-sm">
                                                {/* Live Badge */}
                                                {isLive && (
                                                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold uppercase rounded animate-pulse">
                                                        Live
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                                    <span>{matchDate.toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' })} {matchDate.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</span>
                                                    {match.venue && <span className="truncate max-w-[120px]">{match.venue.split(',')[0]}</span>}
                                                </div>

                                                <div className="flex items-center justify-between gap-4 mb-4">
                                                    {/* Home */}
                                                    <div className="flex flex-col items-center gap-2 flex-1 text-center">
                                                        <div className="w-8 h-8 relative flex items-center justify-center">
                                                            {match.homeTeamLogoUrl ? (
                                                                <img src={match.homeTeamLogoUrl} alt="" className="w-full h-full object-contain" />
                                                            ) : (
                                                                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-[8px]">H</div>
                                                            )}
                                                        </div>
                                                        <span className="font-semibold text-sm leading-tight">{match.homeTeamName}</span>
                                                    </div>

                                                    {/* Center Area */}
                                                    <div className="flex flex-col items-center gap-1">
                                                        {mode === 'betting' ? (
                                                            // BETTING INPUTS
                                                            <div className="flex items-center gap-2">
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    max="99"
                                                                    className={`w-10 h-9 text-center p-0 font-bold focus:ring-1 focus:ring-primary outline-none transition-colors ${isLocked ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-80' : 'bg-background'
                                                                        } ${homeClass || (isLocked ? '' : 'border-input')}`}
                                                                    style={homeClass ? { borderColor: 'var(--border-color)', borderWidth: '2px' } : {}}
                                                                    placeholder="-"
                                                                    value={scores.home}
                                                                    onChange={(e) => onPredictionChange?.(match.id, 'home', e.target.value)}
                                                                    disabled={isLocked || isSaving}
                                                                />
                                                                <span className="text-muted-foreground font-medium">-</span>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    max="99"
                                                                    className={`w-10 h-9 text-center p-0 font-bold focus:ring-1 focus:ring-primary outline-none transition-colors ${isLocked ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-80' : 'bg-background'
                                                                        } ${awayClass || (isLocked ? '' : 'border-input')}`}
                                                                    style={awayClass ? { borderColor: 'var(--border-color)', borderWidth: '2px' } : {}}
                                                                    placeholder="-"
                                                                    value={scores.away}
                                                                    onChange={(e) => onPredictionChange?.(match.id, 'away', e.target.value)}
                                                                    disabled={isLocked || isSaving}
                                                                />
                                                            </div>
                                                        ) : (
                                                            // VIEW MODE SCORE
                                                            <div className="flex items-center justify-center min-w-[40px]">
                                                                {(matchDate <= now || isFinished) && (
                                                                    <div className={`font-bold font-mono px-2 py-0.5 rounded text-xs border whitespace-nowrap ${isLive ? 'bg-red-50 text-red-600 border-red-200' : 'bg-muted/50'}`}>
                                                                        {match.homeScore ?? 0} - {match.awayScore ?? 0}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Result Label if Finished */}
                                                        {mode === 'betting' && isFinished && (
                                                            <div className="text-[10px] font-mono text-muted-foreground mt-1">
                                                                Res: {match.homeScore} - {match.awayScore}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Away */}
                                                    <div className="flex flex-col items-center gap-2 flex-1 text-center">
                                                        <div className="w-8 h-8 relative flex items-center justify-center">
                                                            {match.awayTeamLogoUrl ? (
                                                                <img src={match.awayTeamLogoUrl} alt="" className="w-full h-full object-contain" />
                                                            ) : (
                                                                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-[8px]">A</div>
                                                            )}
                                                        </div>
                                                        <span className="font-semibold text-sm leading-tight">{match.awayTeamName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Right Column: Standings Table */}
                                <div className="p-4 bg-muted/5 text-sm overflow-x-auto">
                                    {mode === 'betting' && (
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold text-sm">Live Tabell</h4>
                                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">Baserat på dina tips</span>
                                        </div>
                                    )}
                                    <StandingsTable standings={groupStandings.length > 0 ? groupStandings : standings} compact={mode === 'betting'} />
                                </div>
                            </div>
                        </CardContent>
                    </Card >
                )
            })}
        </div >
    )
}
