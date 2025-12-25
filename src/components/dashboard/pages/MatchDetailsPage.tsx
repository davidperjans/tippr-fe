import { useParams, useNavigate } from "react-router-dom"
import { useMatches, usePredictions, useLeagues, useTournamentTeams, useVenueByMatch, useTeam } from "@/hooks/api"
import { MatchStatus } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin } from "lucide-react"
import { ScoreWidget } from "@/components/matches/ScoreWidget"
import { MatchStats } from "@/components/matches/MatchStats"
import { ApiSportsWidget, useApiSportsKey } from "@/components/widgets/ApiSportsWidget"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function MatchDetailsPage() {
    const { matchId } = useParams<{ matchId: string }>()
    const navigate = useNavigate()

    // Get basic data
    const { data: leagues } = useLeagues()
    const activeTournamentId = leagues?.[0]?.tournamentId
    const { data: matches, isLoading: matchesLoading } = useMatches(activeTournamentId)
    const { data: predictions } = usePredictions(leagues?.[0]?.id)
    const { data: teams } = useTournamentTeams(activeTournamentId || '')
    const { data: venue } = useVenueByMatch(matchId || '')

    const match = matches?.find(m => m.id === matchId)
    const prediction = predictions?.find(p => p.matchId === matchId)

    // Ensure we have team details (displayName fallback if not in match obj)
    // The match object usually has names, but we might want full team objects for better data
    // In a real app we might fetch useTeam(match.homeTeamId) here if we need more depth

    // API-Sports integration (keep as supplementary)
    const apiSportsKey = useApiSportsKey()
    const homeTeam = teams?.find(t => t.id === match?.homeTeamId)
    const awayTeam = teams?.find(t => t.id === match?.awayTeamId)
    const apiSportsFixtureId = match?.apiFootballId ? parseInt(match.apiFootballId) : undefined
    const homeTeamApiId = homeTeam?.apiFootballId ? parseInt(homeTeam.apiFootballId) : undefined
    const awayTeamApiId = awayTeam?.apiFootballId ? parseInt(awayTeam.apiFootballId) : undefined
    const apiSportsTeamIds: [number, number] | undefined =
        (homeTeamApiId && awayTeamApiId) ? [homeTeamApiId, awayTeamApiId] : undefined


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

    // Prediction Result
    const isFinished = match.status === MatchStatus.Finished
    const predictionResult = prediction && isFinished && match.homeScore !== null && match.awayScore !== null ? {
        points: prediction.pointsEarned,
        isExact: prediction.homeScore === match.homeScore && prediction.awayScore === match.awayScore
    } : null;


    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Tillbaka
            </Button>

            <ScoreWidget match={match} />

            {/* User Prediction */}
            {prediction && (
                <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-text-tertiary" />
                        <span className="font-medium text-text-secondary">Din Tippning:</span>
                        <span className="font-bold text-lg text-text-primary ml-2">{prediction.homeScore} - {prediction.awayScore}</span>
                    </div>
                    {predictionResult && (
                        <div className={cn(
                            "px-3 py-1 rounded-lg text-sm font-bold",
                            predictionResult.points !== null && predictionResult.points > 0
                                ? "bg-brand-100 text-brand-600"
                                : "bg-bg-subtle text-text-tertiary"
                        )}>
                            {predictionResult.points !== null ? `+${predictionResult.points}p` : '0p'}
                        </div>
                    )}
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <MatchStats match={match} />

                    {/* Lineups (API-Sports) */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Startelvor (API-Sports)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ApiSportsWidget
                                apiKey={apiSportsKey}
                                type="game"
                                gameId={apiSportsFixtureId}
                                gameTab="lineups"
                                refresh={match.status === MatchStatus.InProgress ? 30 : false}
                                showErrors={false}
                                className="min-h-[200px]"
                            />
                            {!apiSportsKey && <div className="text-center text-sm text-text-tertiary py-4">API-nyckel saknas för startelvor.</div>}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Venue Info Widget */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Arena
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-hidden">
                            {venue ? (
                                <div>
                                    {venue.imageUrl && (
                                        <div className="h-32 w-full overflow-hidden">
                                            <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="p-4 space-y-2">
                                        <div className="font-medium text-text-primary">{venue.name}</div>
                                        {venue.city && <div className="text-sm text-text-secondary">{venue.city}</div>}
                                        {venue.capacity && (
                                            <div className="text-xs text-text-tertiary mt-2">
                                                Kapacitet: <span className="font-mono text-text-secondary">{venue.capacity.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {venue.surface && (
                                            <div className="text-xs text-text-tertiary">
                                                Underlag: <span className="font-mono text-text-secondary">{venue.surface}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4">
                                    <div className="font-medium text-text-primary">{match.venue || "Okänd Arena"}</div>
                                    {/* Fallback if we only have the string from match object */}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
