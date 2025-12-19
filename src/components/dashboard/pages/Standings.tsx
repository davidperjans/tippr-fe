import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLeagues, useLeagueStandings } from "@/hooks/api"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Trophy, Users } from "lucide-react"

export function Standings() {
  const GLOBAL_LEAGUE_ID = "2515b538-bb42-4c9f-90cb-dcae7554b858"
  const { data: globalStandings, isLoading: globalLoading } = useLeagueStandings(GLOBAL_LEAGUE_ID)
  const { data: leagues, isLoading: leaguesLoading } = useLeagues()

  const privateLeagues = leagues?.filter(l => !l.isGlobal) || []
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>("")

  // Set default selected league when leagues load
  useEffect(() => {
    if (privateLeagues && privateLeagues.length > 0 && !selectedLeagueId) {
      setSelectedLeagueId(privateLeagues[0].id)
    }
  }, [privateLeagues, selectedLeagueId])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Topplista</h2>
        <p className="text-muted-foreground">Se vem som är bäst på att tippa.</p>
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="global">Globala</TabsTrigger>
          <TabsTrigger value="leagues">Ligor</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-6">
          <StandingsTable
            title="Global Topplista"
            data={globalStandings}
            isLoading={globalLoading}
          />
        </TabsContent>

        <TabsContent value="leagues" className="mt-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="league-select" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Välj liga
              </label>
              {leaguesLoading ? (
                <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
              ) : privateLeagues.length > 0 ? (
                <select
                  id="league-select"
                  value={selectedLeagueId}
                  onChange={(e) => setSelectedLeagueId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {privateLeagues.map((league) => (
                    <option key={league.id} value={league.id}>
                      {league.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-muted-foreground p-2 border rounded bg-muted/20">
                  Du är inte med i några privata ligor än.
                </div>
              )}
            </div>

            {selectedLeagueId && (
              <LeagueStandings id={selectedLeagueId} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LeagueStandings({ id }: { id: string }) {
  const { data: standings, isLoading } = useLeagueStandings(id)
  return <StandingsTable title="Tabell" data={standings} isLoading={isLoading} />
}

function StandingsTable({ title, data, isLoading }: { title: string, data: any[] | undefined, isLoading: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Ingen data tillgänglig än.
          </div>
        ) : (
          <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-16">#</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Spelare</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center hidden sm:table-cell">Rätt Tips</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center hidden sm:table-cell">Bonus</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Poäng</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {data.map((row, index) => (
                  <tr key={row.userId} className={`border-b transition-colors hover:bg-muted/50 ${index < 3 ? 'bg-muted/20' : ''}`}>
                    <td className="p-4 align-middle">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-slate-100 text-slate-700' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                            'text-muted-foreground'
                        }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 border border-border/50">
                          <AvatarImage src={row.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.username}`} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-xs font-bold text-emerald-700">
                            {row.username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className={`font-medium ${index === 0 ? 'text-yellow-700' : ''}`}>{row.username || 'Anonym'}</span>
                        {index === 0 && <Trophy className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-center hidden sm:table-cell">{row.matchPoints}</td>
                    <td className="p-4 align-middle text-center hidden sm:table-cell">{row.bonusPoints}</td>
                    <td className="p-4 align-middle text-right font-bold text-lg text-emerald-600">{row.totalPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
      {data && data.length > 0 && (
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Visar {data.length} av {data.length} spelare
          </div>
          <Button variant="outline" size="sm" disabled>
            Visa fler
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
