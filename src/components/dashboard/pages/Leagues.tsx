import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Loader2, ArrowRight, Trophy, Search, Crown, Globe } from "lucide-react"
import { Link } from 'react-router-dom'
import { FindLeagueDialog } from "../leagues/FindLeagueDialog"
import { CreateLeagueDialog } from "../leagues/CreateLeagueDialog"
import { useLeagues, useJoinLeague } from "@/hooks/api"
import { toast } from "react-hot-toast"
import { useAuth } from "@/contexts/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

function LeaguesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border-subtle p-6 space-y-4">
            <div className="flex justify-between">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="w-16 h-5 rounded-full" />
            </div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Leagues() {
  const { data: leaguesData, isLoading } = useLeagues()
  const { backendUser } = useAuth()
  const joinLeague = useJoinLeague()

  const leagues = leaguesData ? [...leaguesData].sort((a, b) => {
    if (a.isGlobal && !b.isGlobal) return -1
    if (!a.isGlobal && b.isGlobal) return 1
    return (a.name || '').localeCompare(b.name || '')
  }) : []

  const handleJoinGlobal = async () => {
    try {
      await joinLeague.mutateAsync({ leagueId: '2515b538-bb42-4c9f-90cb-dcae7554b858' })
      toast.success("Du har gått med i Globala Ligan!")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Okänt fel"
      toast.error("Kunde inte gå med: " + message)
    }
  }

  if (isLoading) return <LeaguesSkeleton />

  // Empty State
  if (!leagues || leagues.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Välkommen till Ligor</h1>
          <p className="text-text-secondary text-lg max-w-md mx-auto">
            Du är inte med i några ligor än. Välj ett alternativ nedan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
          {/* Global League */}
          <motion.div
            onClick={handleJoinGlobal}
            className="group relative flex flex-col items-center justify-center p-8 h-64 border-2 border-dashed border-blue-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50/10 transition-all cursor-pointer bg-bg-surface"
            whileHover={{ y: -4 }}
          >
            <div className="p-4 rounded-2xl bg-blue-100/20 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <Globe className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Globala Ligan</h3>
            <p className="text-text-secondary text-center text-sm px-4">
              Gå med i den officiella globala ligan.
            </p>
            <Button variant="ghost" className="mt-6 group-hover:text-blue-600" disabled={joinLeague.isPending}>
              {joinLeague.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Gå med <ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          </motion.div>

          {/* Create League */}
          <CreateLeagueDialog trigger={
            <motion.div
              className="group relative flex flex-col items-center justify-center p-8 h-64 border-2 border-dashed rounded-2xl hover:border-brand-500 hover:bg-brand-50/10 transition-all cursor-pointer bg-bg-surface"
              whileHover={{ y: -4 }}
            >
              <div className="p-4 rounded-2xl bg-brand-100/20 text-brand-600 mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Skapa en liga</h3>
              <p className="text-text-secondary text-center text-sm px-4">
                Starta en egen liga och bjud in vänner.
              </p>
              <Button variant="ghost" className="mt-6 group-hover:text-brand-600">
                Starta nu <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          } />

          {/* Join League */}
          <FindLeagueDialog trigger={
            <motion.div
              className="group relative flex flex-col items-center justify-center p-8 h-64 border-2 border-dashed rounded-2xl hover:border-blue-500 hover:bg-blue-50/10 transition-all cursor-pointer bg-bg-surface"
              whileHover={{ y: -4 }}
            >
              <div className="p-4 rounded-2xl bg-blue-100/20 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Gå med i en liga</h3>
              <p className="text-text-secondary text-center text-sm px-4">
                Har du en inbjudningskod?
              </p>
              <Button variant="ghost" className="mt-6 group-hover:text-blue-600">
                Gå med <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          } />
        </div>
      </motion.div>
    )
  }

  // Standard View
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">Mina Ligor</h2>
          <p className="text-text-secondary">Hantera dina ligor.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <FindLeagueDialog />
          <CreateLeagueDialog />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {leagues.map((league, i) => {
          const isOwner = backendUser?.userId && league.ownerId
            ? backendUser.userId.toLowerCase() === league.ownerId.toLowerCase()
            : false;

          return (
            <motion.div
              key={league.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/leagues/${league.id}`} className="block group/card">
                <Card className={`h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer ${league.isGlobal ? 'border-blue-500/50 bg-blue-50/5' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      {league.imageUrl ? (
                        <div className="w-10 h-10 shrink-0">
                          <img src={league.imageUrl} alt={league.name || 'League'} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                          {(league.name || 'L')[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex gap-1">
                          {isOwner && (
                            <span className="flex items-center gap-1 text-2xs uppercase font-bold bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-full border border-purple-200">
                              <Crown className="w-3 h-3" /> Ägare
                            </span>
                          )}
                          {league.isGlobal ? (
                            <span className="text-2xs uppercase font-bold bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200">Global</span>
                          ) : league.isPublic ? (
                            <span className="text-2xs uppercase font-bold bg-bg-subtle text-text-tertiary px-2 py-0.5 rounded-full border border-border-subtle">Publik</span>
                          ) : (
                            <span className="text-2xs uppercase font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full border border-amber-200">Privat</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="mt-4 truncate group-hover/card:text-brand-600 transition-colors">{league.name}</CardTitle>
                    <CardDescription className="line-clamp-1">{league.description || 'Ingen beskrivning'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-text-secondary">
                      <Users className="w-4 h-4 mr-2" />
                      {league.memberCount || 0} deltagare
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
