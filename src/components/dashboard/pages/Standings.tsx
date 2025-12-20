import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLeagues, useLeagueStandings } from "@/hooks/api"
import { useState, useEffect } from "react"
import { UserStandingsTable } from "../components/UserStandingsTable"

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
          <UserStandingsTable
            title="Global Topplista"
            data={globalStandings}
            isLoading={globalLoading}
            showFooter={true}
            limit={50}
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
              <LeagueStandingsWrapper id={selectedLeagueId} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LeagueStandingsWrapper({ id }: { id: string }) {
  const { data: standings, isLoading } = useLeagueStandings(id)
  return <UserStandingsTable title="Tabell" data={standings} isLoading={isLoading} />
}

