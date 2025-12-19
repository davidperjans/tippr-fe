import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, TrendingUp, Users, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MatchStatus } from "@/lib/api"
import { Link } from 'react-router-dom'
import { useLeagues, useMatches, useTournaments } from "@/hooks/api"

export function Overview() {

  // 1. Fetch Leagues
  const { data: leagues, isLoading: leaguesLoading, error: leaguesError } = useLeagues()

  // 2. Fetch Active Tournaments
  const { data: tournaments, isLoading: tournamentsLoading } = useTournaments(true)

  // 3. Fetch Matches (Dependent on first active tournament)
  const activeTournamentId = tournaments?.[0]?.id
  const { data: matches, isLoading: matchesLoading } = useMatches(activeTournamentId)

  const isLoading = leaguesLoading || tournamentsLoading || matchesLoading

  // Derived State
  const upcomingMatches = (matches || [])
    .filter(m => m.status === MatchStatus.Scheduled)
    .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())
    .slice(0, 5)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (leaguesError) {
    return <div className="p-4 text-destructive bg-destructive/10 rounded-lg">Kunde inte ladda dashboard-data.</div>
  }

  const activeLeaguesCount = leagues?.length || 0
  const upcomingMatchesCount = upcomingMatches.length || 0

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Poäng</CardTitle>
            <Trophy className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">--</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rankning</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Global rank</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva Ligor</CardTitle>
            <Users className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLeaguesCount}</div>
            <p className="text-xs text-muted-foreground">Du är med i {activeLeaguesCount} ligor</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kommande Tips</CardTitle>
            <ArrowRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMatchesCount}</div>
            <p className="text-xs text-muted-foreground">Matcher att tippa</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Sections */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Kommande Matcher</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingMatches.length === 0 ? (
              <p className="text-muted-foreground text-sm">Inga kommande matcher hittades.</p>
            ) : (
              <div className="space-y-4">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {match.homeTeamName || 'Home'} vs {match.awayTeamName || 'Away'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(match.matchDate).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                    <Button size="sm" variant="secondary" asChild>
                      <Link to="/betting">Tippa</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Dina Ligor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(leagues || []).length === 0 ? (
                <p className="text-muted-foreground text-sm">Du är inte med i några ligor än.</p>
              ) : (
                (leagues || []).map((league, i) => (
                  <div key={league.id || i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                        {(league.name || '?')[0]}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate max-w-[150px]">{league.name}</p>
                        <p className="text-xs text-muted-foreground">{league.isPublic ? 'Publik' : 'Privat'}</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" asChild>
                      <Link to={`/leagues/${league.id}`}>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                ))
              )}
              <Button variant="outline" className="w-full mt-2" size="sm" asChild>
                <Link to="/leagues">Visa alla ligor</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
