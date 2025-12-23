import { useParams, useNavigate } from "react-router-dom"
import { useMatches, usePredictions, useLeagues, useTournamentTeams } from "@/hooks/api"
import { MatchStatus, MatchStage } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, MapPin, Trophy, Users, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { sv } from "date-fns/locale"
import { ApiSportsWidget, useApiSportsKey } from "@/components/widgets/ApiSportsWidget"

// Status label helper
function getStatusLabel(status: number) {
    switch (status) {
        case MatchStatus.Scheduled: return { text: "Planerad", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" }
        case MatchStatus.InProgress: return { text: "Pågår", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" }
        case MatchStatus.Finished: return { text: "Avslutad", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" }
        case MatchStatus.Postponed: return { text: "Uppskjuten", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" }
        case MatchStatus.Cancelled: return { text: "Inställd", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" }
        default: return { text: "Okänd", color: "bg-gray-100 text-gray-700" }
    }
}

// Stage label helper
function getStageLabel(stage: number) {
    switch (stage) {
        case MatchStage.Group: return "Gruppspel"
        case MatchStage.RoundOf16: return "Åttondelsfinaler"
        case MatchStage.QuarterFinal: return "Kvartsfinaler"
        case MatchStage.SemiFinal: return "Semifinaler"
        case MatchStage.Final: return "Final"
        default: return "Okänd"
    }
}

export function MatchDetailsPage() {
    const { matchId } = useParams<{ matchId: string }>()
    const navigate = useNavigate()

    // Get all matches and find the one we need
    const { data: leagues } = useLeagues()
    const activeTournamentId = leagues?.[0]?.tournamentId
    const { data: matches, isLoading: matchesLoading } = useMatches(activeTournamentId)
    const { data: predictions } = usePredictions(leagues?.[0]?.id)

    const match = matches?.find(m => m.id === matchId)
    const prediction = predictions?.find(p => p.matchId === matchId)

    if (matchesLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            </div>
        )
    }

    if (!match) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-text-secondary">Matchen kunde inte hittas</p>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Tillbaka
                </Button>
            </div>
        )
    }

    const matchDate = new Date(match.matchDate)
    const statusInfo = getStatusLabel(match.status)
    const isFinished = match.status === MatchStatus.Finished
    const isLive = match.status === MatchStatus.InProgress

    // API-Sports integration
    const apiSportsKey = useApiSportsKey()

    // Fetch teams to get their API-Sports IDs
    const { data: teams } = useTournamentTeams(activeTournamentId || '')
    const homeTeam = teams?.find(t => t.id === match.homeTeamId)
    const awayTeam = teams?.find(t => t.id === match.awayTeamId)

    // Parse IDs safely
    const apiSportsFixtureId = match.apiFootballId ? parseInt(match.apiFootballId) : undefined
    const homeTeamApiId = homeTeam?.apiFootballId ? parseInt(homeTeam.apiFootballId) : undefined
    const awayTeamApiId = awayTeam?.apiFootballId ? parseInt(awayTeam.apiFootballId) : undefined

    const apiSportsTeamIds: [number, number] | undefined =
        (homeTeamApiId && awayTeamApiId) ? [homeTeamApiId, awayTeamApiId] : undefined

    // Calculate prediction result

    // Calculate prediction result
    let predictionResult = null
    if (prediction && isFinished && match.homeScore !== null && match.awayScore !== null) {
        const predHome = prediction.homeScore
        const predAway = prediction.awayScore
        const isExact = predHome === match.homeScore && predAway === match.awayScore
        const predOutcome = predHome > predAway ? '1' : predHome < predAway ? '2' : 'x'
        const actualOutcome = match.homeScore > match.awayScore ? '1' : match.awayScore > match.homeScore ? '2' : 'x'
        const outcomeCorrect = predOutcome === actualOutcome

        predictionResult = {
            isExact,
            outcomeCorrect,
            points: prediction.pointsEarned
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Back Button */}
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Tillbaka
            </Button>

            {/* Main Match Card */}
            <Card className="overflow-hidden">
                {/* Header with status */}
                <div className={cn(
                    "px-4 py-2 flex items-center justify-between",
                    isLive ? "bg-red-500 text-white" : "bg-bg-subtle"
                )}>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm font-medium">{getStageLabel(match.stage)}</span>
                        {match.groupName && <span className="text-sm">• Grupp {match.groupName}</span>}
                    </div>
                    <span className={cn("px-2 py-0.5 rounded text-xs font-medium", statusInfo.color)}>
                        {statusInfo.text}
                    </span>
                </div>

                <CardContent className="p-6">
                    {/* Teams and Score */}
                    <div className="flex items-center justify-center gap-6 mb-6">
                        {/* Home Team */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                            {match.homeTeamLogoUrl ? (
                                <img src={match.homeTeamLogoUrl} className="w-16 h-16 object-contain" alt="" />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-brand-100 flex items-center justify-center text-2xl font-bold text-brand-600">
                                    {(match.homeTeamName || 'H')[0]}
                                </div>
                            )}
                            <span className="text-lg font-semibold text-text-primary text-center">{match.homeTeamName}</span>
                        </div>

                        {/* Score */}
                        <div className="flex flex-col items-center gap-2">
                            {isFinished || isLive ? (
                                <div className={cn(
                                    "flex items-center gap-3 px-6 py-3 rounded-xl",
                                    isLive ? "bg-red-100 dark:bg-red-900/20" : "bg-bg-muted"
                                )}>
                                    <span className="text-4xl font-bold text-text-primary">{match.homeScore ?? 0}</span>
                                    <span className="text-2xl text-text-tertiary">-</span>
                                    <span className="text-4xl font-bold text-text-primary">{match.awayScore ?? 0}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1 px-6 py-3 rounded-xl bg-bg-muted">
                                    <span className="text-sm text-text-tertiary">Avspark</span>
                                    <span className="text-2xl font-bold text-text-primary">
                                        {format(matchDate, "HH:mm")}
                                    </span>
                                </div>
                            )}
                            {isLive && (
                                <span className="text-sm font-medium text-red-600 dark:text-red-400 animate-pulse">● LIVE</span>
                            )}
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                            {match.awayTeamLogoUrl ? (
                                <img src={match.awayTeamLogoUrl} className="w-16 h-16 object-contain" alt="" />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-brand-100 flex items-center justify-center text-2xl font-bold text-brand-600">
                                    {(match.awayTeamName || 'A')[0]}
                                </div>
                            )}
                            <span className="text-lg font-semibold text-text-primary text-center">{match.awayTeamName}</span>
                        </div>
                    </div>

                    {/* Match Info */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-text-secondary border-t border-border-subtle pt-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{format(matchDate, "EEEE d MMMM yyyy", { locale: sv })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{format(matchDate, "HH:mm")}</span>
                        </div>
                        {match.venue && (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{match.venue}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* User Prediction Card */}
            {prediction && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Din tippning
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-xl font-bold">
                                    <span className={cn(
                                        "px-3 py-1 rounded",
                                        predictionResult?.isExact || (isFinished && prediction.homeScore === match.homeScore)
                                            ? "bg-success/20 text-success"
                                            : "bg-bg-muted text-text-primary"
                                    )}>
                                        {prediction.homeScore}
                                    </span>
                                    <span className="text-text-tertiary">-</span>
                                    <span className={cn(
                                        "px-3 py-1 rounded",
                                        predictionResult?.isExact || (isFinished && prediction.awayScore === match.awayScore)
                                            ? "bg-success/20 text-success"
                                            : "bg-bg-muted text-text-primary"
                                    )}>
                                        {prediction.awayScore}
                                    </span>
                                </div>

                                {predictionResult && (
                                    <span className={cn(
                                        "px-2 py-1 rounded text-sm font-semibold",
                                        predictionResult.isExact
                                            ? "bg-success/20 text-success"
                                            : predictionResult.outcomeCorrect
                                                ? "bg-warning/20 text-warning"
                                                : "bg-danger/20 text-danger"
                                    )}>
                                        {predictionResult.isExact ? "Exakt!" : predictionResult.outcomeCorrect ? "Rätt utgång" : "Fel utgång"}
                                    </span>
                                )}
                            </div>

                            {predictionResult?.points !== null && predictionResult?.points !== undefined && (
                                <div className={cn(
                                    "px-3 py-1 rounded-lg text-lg font-bold",
                                    predictionResult.points > 0
                                        ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                                        : "bg-bg-muted text-text-tertiary"
                                )}>
                                    +{predictionResult.points} poäng
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* API-Sports Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lineups/Stats Widget */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Matchinfo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ApiSportsWidget
                            apiKey={apiSportsKey}
                            type="game"
                            gameId={apiSportsFixtureId}
                            gameTab="lineups"
                            refresh={isLive ? 30 : false}
                            showErrors={!apiSportsKey}
                            className="min-h-[200px]"
                        />
                    </CardContent>
                </Card>

                {/* Head-to-Head Widget */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Head-to-Head
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ApiSportsWidget
                            apiKey={apiSportsKey}
                            type="h2h"
                            teamIds={apiSportsTeamIds}
                            showErrors={!apiSportsKey}
                            className="min-h-[200px]"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Info about configuration if missing */}
            {(!apiSportsKey || !apiSportsFixtureId || !apiSportsTeamIds) && (
                <div className="text-center text-sm text-text-tertiary p-4 bg-bg-subtle rounded-lg space-y-2">
                    {!apiSportsKey && (
                        <div>
                            <p>För att visa startelvor och head-to-head:</p>
                            <p className="font-mono text-xs mt-1">VITE_API_SPORTS_KEY=din_nyckel</p>
                        </div>
                    )}
                    {apiSportsKey && (!apiSportsFixtureId || !apiSportsTeamIds) && (
                        <div>
                            <p>Widgetar aktiverade men match/lag saknar koppling till API-Sports.</p>
                            <p className="text-xs mt-1">Se till att <code>apiFootballId</code> är satt i databasen.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
