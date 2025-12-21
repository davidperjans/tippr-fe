import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLeagues, useLeagueStandings } from "@/hooks/api"
import { useState, useEffect } from "react"
import { UserStandingsTable } from "../components/UserStandingsTable"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export function Standings() {
  const GLOBAL_LEAGUE_ID = "2515b538-bb42-4c9f-90cb-dcae7554b858"
  const { data: globalStandings, isLoading: globalLoading } = useLeagueStandings(GLOBAL_LEAGUE_ID)
  const { data: leagues, isLoading: leaguesLoading } = useLeagues()

  const privateLeagues = leagues?.filter(l => !l.isGlobal) || []
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>("")

  useEffect(() => {
    if (privateLeagues && privateLeagues.length > 0 && !selectedLeagueId) {
      setSelectedLeagueId(privateLeagues[0].id)
    }
  }, [privateLeagues, selectedLeagueId])

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Topplista</h2>
        <p className="text-text-secondary">Se vem som är bäst på att tippa.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="global">Globala</TabsTrigger>
            <TabsTrigger value="leagues">Ligor</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <UserStandingsTable
                title="Global Topplista"
                data={globalStandings}
                isLoading={globalLoading}
                showFooter={true}
                limit={50}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="leagues" className="mt-6">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="league-select" className="text-sm font-medium text-text-primary">
                  Välj liga
                </label>
                {leaguesLoading ? (
                  <Skeleton className="h-10 w-full rounded-xl" />
                ) : privateLeagues.length > 0 ? (
                  <select
                    id="league-select"
                    value={selectedLeagueId}
                    onChange={(e) => setSelectedLeagueId(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                  >
                    {privateLeagues.map((league) => (
                      <option key={league.id} value={league.id}>
                        {league.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-text-tertiary p-3 border border-border-subtle rounded-xl bg-bg-subtle">
                    Du är inte med i några privata ligor än.
                  </div>
                )}
              </div>

              {selectedLeagueId && (
                <motion.div
                  key={selectedLeagueId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LeagueStandingsWrapper id={selectedLeagueId} />
                </motion.div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

function LeagueStandingsWrapper({ id }: { id: string }) {
  const { data: standings, isLoading } = useLeagueStandings(id)
  return <UserStandingsTable title="Tabell" data={standings} isLoading={isLoading} />
}
