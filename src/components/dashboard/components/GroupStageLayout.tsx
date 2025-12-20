import { MatchStatus, type MatchDto, type LeagueSettingsDto } from "@/lib/api"
import { StandingsTable, type TeamStats } from "@/components/standings/StandingsTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, Clock } from "lucide-react"
import { motion } from "framer-motion"

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
        <div className="space-y-6">
            {Object.entries(groups).map(([groupName, groupMatches], groupIndex) => {
                const groupTeamIds = new Set<string>()
                groupMatches.forEach(m => {
                    groupTeamIds.add(m.homeTeamId)
                    groupTeamIds.add(m.awayTeamId)
                })
                const groupStandings = standings.filter(t => groupTeamIds.has(t.id))

                return (
                    <motion.div
                        key={groupName}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIndex * 0.1 }}
                    >
                        <Card className="overflow-hidden border-border-subtle">
                            <CardHeader className="bg-gradient-to-r from-brand-500/10 to-brand-600/5 py-2.5 border-b border-border-subtle">
                                <CardTitle className="text-sm font-bold text-text-primary">Grupp {groupName}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 xl:grid-cols-[1fr,340px]">
                                    {/* Left: Match List */}
                                    <div className="divide-y divide-border-subtle">
                                        {groupMatches.map((match, i) => (
                                            <MatchRow
                                                key={match.id}
                                                match={match}
                                                mode={mode}
                                                scores={predictionValues?.[match.id]}
                                                onPredictionChange={onPredictionChange}
                                                isSaving={isSaving}
                                                leagueSettings={leagueSettings}
                                                delay={i * 0.02}
                                            />
                                        ))}
                                    </div>

                                    {/* Right: Standings */}
                                    <div className="p-4 bg-bg-subtle/30 border-t xl:border-t-0 xl:border-l border-border-subtle">
                                        {mode === 'betting' && (
                                            <h4 className="font-semibold text-2xs text-text-tertiary uppercase tracking-wider mb-2">Live Tabell</h4>
                                        )}
                                        <StandingsTable
                                            teams={groupStandings.length > 0 ? groupStandings : standings}
                                            compact={true}
                                            showQualification={true}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )
            })}
        </div>
    )
}

interface MatchRowProps {
    match: MatchDto
    mode: 'view' | 'betting'
    scores?: { home: string, away: string }
    onPredictionChange?: (matchId: string, type: 'home' | 'away', value: string) => void
    isSaving?: boolean
    leagueSettings?: LeagueSettingsDto
    delay?: number
}

function MatchRow({ match, mode, scores = { home: '', away: '' }, onPredictionChange, isSaving, leagueSettings, delay = 0 }: MatchRowProps) {
    const now = new Date()
    const matchDate = new Date(match.matchDate)
    const isFinished = match.status === MatchStatus.Finished
    const isLive = match.status !== MatchStatus.Scheduled && !isFinished

    let isLocked = false
    if (mode === 'betting' && leagueSettings) {
        const deadlineMinutes = leagueSettings.deadlineMinutes || 0
        const lockTime = new Date(matchDate.getTime() - deadlineMinutes * 60000)
        if (now > lockTime && !leagueSettings.allowLateEdits) isLocked = true
    }
    if (matchDate <= now || isFinished || isLive) isLocked = true

    let feedbackClass = ""
    if (isFinished && scores.home && scores.away && match.homeScore !== null && match.awayScore !== null) {
        const predHome = parseInt(scores.home)
        const predAway = parseInt(scores.away)
        if (predHome === match.homeScore && predAway === match.awayScore) {
            feedbackClass = "bg-success/5 border-l-2 border-l-success"
        } else {
            const predRes = predHome > predAway ? '1' : predHome < predAway ? '2' : 'x'
            const actRes = match.homeScore > match.awayScore ? '1' : match.awayScore > match.homeScore ? '2' : 'x'
            feedbackClass = predRes === actRes ? "bg-warning/5 border-l-2 border-l-warning" : "bg-danger/5 border-l-2 border-l-danger opacity-70"
        }
    }
    const venueName = match.venue;
    // const venueName = match.venue?.split(',')[0]?.trim()

    return (
        <motion.div
            className={`p-3 hover:bg-bg-subtle/50 transition-colors ${feedbackClass}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
        >
            {/* Row 1: Teams and Score - Fixed widths for perfect centering */}
            <div className="flex items-center justify-center">
                {/* Home Team - fixed width, right aligned */}
                <div className="w-28 flex items-center gap-2 justify-end">
                    <span className="text-sm font-semibold text-text-primary">{match.homeTeamName}</span>
                    {match.homeTeamLogoUrl ? (
                        <img src={match.homeTeamLogoUrl} className="w-5 h-5 object-contain shrink-0" alt="" />
                    ) : (
                        <div className="w-5 h-5 rounded bg-brand-100 flex items-center justify-center text-2xs font-bold text-brand-600 shrink-0">
                            {(match.homeTeamName || 'H')[0]}
                        </div>
                    )}
                </div>

                {/* Score / VS - centered */}
                <div className="mx-3 shrink-0">
                    {mode === 'betting' ? (
                        <div className="flex items-center gap-1">
                            <Input
                                className={`w-8 h-7 text-center p-0 text-sm font-bold rounded ${isLocked ? 'bg-bg-subtle text-text-tertiary' : ''}`}
                                value={scores.home}
                                onChange={e => onPredictionChange?.(match.id, 'home', e.target.value)}
                                disabled={isLocked || isSaving}
                                placeholder="-"
                                maxLength={2}
                            />
                            <span className="text-text-tertiary text-sm font-medium">-</span>
                            <Input
                                className={`w-8 h-7 text-center p-0 text-sm font-bold rounded ${isLocked ? 'bg-bg-subtle text-text-tertiary' : ''}`}
                                value={scores.away}
                                onChange={e => onPredictionChange?.(match.id, 'away', e.target.value)}
                                disabled={isLocked || isSaving}
                                placeholder="-"
                                maxLength={2}
                            />
                        </div>
                    ) : (
                        <div className={`font-mono font-bold text-sm px-3 py-1 rounded min-w-[56px] text-center ${isLive ? 'bg-danger/10 text-danger' : 'bg-bg-subtle text-text-primary'}`}>
                            {isLive && <span className="animate-pulse mr-1">●</span>}
                            {match.status === MatchStatus.Scheduled ? 'vs' : `${match.homeScore} - ${match.awayScore}`}
                        </div>
                    )}
                </div>

                {/* Away Team - fixed width, left aligned */}
                <div className="w-28 flex items-center gap-2 justify-start">
                    {match.awayTeamLogoUrl ? (
                        <img src={match.awayTeamLogoUrl} className="w-5 h-5 object-contain shrink-0" alt="" />
                    ) : (
                        <div className="w-5 h-5 rounded bg-brand-100 flex items-center justify-center text-2xs font-bold text-brand-600 shrink-0">
                            {(match.awayTeamName || 'A')[0]}
                        </div>
                    )}
                    <span className="text-sm font-semibold text-text-primary">{match.awayTeamName}</span>
                </div>
            </div>

            {/* Row 2: Date/Time and Venue */}
            <div className="flex items-center justify-center gap-4 mt-2 text-2xs text-text-tertiary">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{matchDate.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })} {matchDate.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {venueName && (
                    <>
                        <span className="text-border-default">|</span>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{venueName}</span>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    )
}
