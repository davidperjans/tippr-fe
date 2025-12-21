import { useState, useEffect } from "react"
import { useLeagues, useMatches, usePredictions, useSubmitPrediction } from "@/hooks/api"

import { GroupStageLayout } from "@/components/dashboard/components/GroupStageLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, ArrowRight, Globe, Lock, Clock, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { LeagueDto, MatchDto } from "@/lib/api"
import { toast } from "react-hot-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

function BettingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border-subtle p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function Betting() {
  const navigate = useNavigate()
  const { data: leagues, isLoading } = useLeagues()
  const [selectedLeague, setSelectedLeague] = useState<LeagueDto | null>(null)
  const [view, setView] = useState<'dashboard' | 'betting'>('dashboard')


  // Derived state
  const globalLeague = leagues?.find(l => l.isGlobal)
  const privateLeagues = leagues?.filter(l => !l.isGlobal) || []
  const hasLeagues = leagues && leagues.length > 0

  const handleLeagueSelect = (league: LeagueDto) => {
    setSelectedLeague(league)
    setView('betting')
  }

  const handleBack = () => {
    setSelectedLeague(null)
    setView('dashboard')
  }

  // --- BETTING VIEW STATE & LOGIC ---
  const { data: matches } = useMatches(selectedLeague?.tournamentId)
  const { data: predictions } = usePredictions(selectedLeague?.id)
  const submitPrediction = useSubmitPrediction()

  const [predictionValues, setPredictionValues] = useState<Record<string, { home: string, away: string }>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Initialize predictions when loaded
  useEffect(() => {
    if (predictions && matches) {
      const initialValues: Record<string, { home: string, away: string }> = {}
      predictions.forEach(p => {
        initialValues[p.matchId] = {
          home: p.homeScore.toString(),
          away: p.awayScore.toString()
        }
      })
      setPredictionValues(initialValues)
    }
  }, [predictions, matches])

  const handleInputChange = (matchId: string, field: 'home' | 'away', value: string) => {
    if (value.length > 2) return // Max 2 digits typically enough
    setPredictionValues(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId] || { home: '', away: '' },
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    if (!selectedLeague) return
    setIsSaving(true)

    try {
      const promises = Object.entries(predictionValues).map(([matchId, scores]) => {
        // Only submit if both scores are present
        if (scores.home === '' || scores.away === '') return Promise.resolve()

        // Check if changed logic could be added here for optimization

        return submitPrediction.mutateAsync({
          leagueId: selectedLeague.id,
          matchId,
          homeScore: parseInt(scores.home),
          awayScore: parseInt(scores.away)
        })
      })

      await Promise.all(promises)
      toast.success("Dina tips har sparats!")
    } catch (error) {
      console.error(error)
      toast.error("Kunde inte spara tipsen. Försök igen.")
    } finally {
      setIsSaving(false)
    }
  }

  // Process matches for display
  const groupMatches = matches?.filter(m => m.stage === 0) || []
  const groups: Record<string, MatchDto[]> = {}
  groupMatches.forEach(match => {
    const groupName = match.groupName || "Matcher"
    if (!groups[groupName]) groups[groupName] = []
    groups[groupName].push(match)
  })
  const sortedGroupNames = Object.keys(groups).sort()

  // Calculate Standings (including predictions)
  const calculateStandings = (matchesList: MatchDto[]) => {
    const stats: Record<string, any> = {}
    const ensureTeam = (id: string, name: string, logo: string | null) => {
      if (!stats[id]) {
        stats[id] = { id, name, logoUrl: logo, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
      }
    }

    matchesList.forEach(m => {
      const homeId = m.homeTeamId
      const awayId = m.awayTeamId

      ensureTeam(homeId, m.homeTeamName || 'Home', m.homeTeamLogoUrl)
      ensureTeam(awayId, m.awayTeamName || 'Away', m.awayTeamLogoUrl)

      let homeScore: number | null = m.homeScore
      let awayScore: number | null = m.awayScore

      const isFinished = new Date(m.matchDate) < new Date()
      const prediction = predictionValues[m.id]

      if (!isFinished && prediction && prediction.home !== '' && prediction.away !== '') {
        homeScore = parseInt(prediction.home)
        awayScore = parseInt(prediction.away)
      }

      if (homeScore !== null && awayScore !== null && !isNaN(homeScore) && !isNaN(awayScore)) {
        const home = stats[homeId]
        const away = stats[awayId]

        home.mp++
        away.mp++
        home.gf += homeScore
        home.ga += awayScore
        away.gf += awayScore
        away.ga += homeScore

        if (homeScore > awayScore) {
          home.w++
          home.pts += 3
          away.l++
        } else if (homeScore < awayScore) {
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

    return Object.values(stats).sort((a: any, b: any) => {
      if (b.pts !== a.pts) return b.pts - a.pts
      const gdA = a.gf - a.ga
      const gdB = b.gf - b.ga
      if (gdB !== gdA) return gdB - gdA
      return b.gf - a.gf
    })
  }

  const standings = calculateStandings(groupMatches)


  if (isLoading) return <BettingSkeleton />

  // --- BETTING VIEW ---
  if (view === 'betting' && selectedLeague) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="-ml-2">
            ← Tillbaka
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Tippa: {selectedLeague.name}</h2>
            <p className="text-muted-foreground">Fyll i dina tips för kommande matcher.</p>
          </div>
        </div>

        {matches && matches.length > 0 && (
          <DeadlineBanner
            settings={selectedLeague.settings || {
              predictionMode: 'PerMatch',
              deadlineMinutes: 60,
              pointsCorrectScore: 5,
              pointsCorrectOutcome: 2,
              pointsCorrectGoals: 1,
              pointsWinner: 10,
              pointsTopScorer: 5,
              pointsRoundOf16Team: 1,
              pointsQuarterFinalTeam: 2,
              pointsSemiFinalTeam: 4,
              pointsFinalTeam: 6,
              pointsMostGoalsGroup: 1,
              pointsMostConcededGroup: 1,
              allowLateEdits: false,
              id: 'default',
              leagueId: selectedLeague.id
            }}
            matches={matches}
          />
        )}

        <Tabs defaultValue="groups" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6 mb-6">
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

          <TabsContent value="groups" className="space-y-8">
            {sortedGroupNames.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Inga matcher i gruppspelet hittades.
                </CardContent>
              </Card>
            ) : (
              <GroupStageLayout
                groups={groups}
                standings={standings}
                mode="betting"
                predictionValues={predictionValues}
                onPredictionChange={handleInputChange}
                isSaving={isSaving}
                leagueSettings={selectedLeague.settings || {
                  predictionMode: 'PerMatch',
                  deadlineMinutes: 60,
                  pointsCorrectScore: 5,
                  pointsCorrectOutcome: 2,
                  pointsCorrectGoals: 1,
                  pointsWinner: 10,
                  pointsTopScorer: 5,
                  pointsRoundOf16Team: 1,
                  pointsQuarterFinalTeam: 2,
                  pointsSemiFinalTeam: 4,
                  pointsFinalTeam: 6,
                  pointsMostGoalsGroup: 1,
                  pointsMostConcededGroup: 1,
                  allowLateEdits: false,
                  id: 'default',
                  leagueId: selectedLeague.id
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="playoffs">
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Tippning för slutspel öppnar senare.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Fixed Bottom Bar for submitting */}
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 pointer-events-none z-50">
          <div className="bg-background/80 backdrop-blur-md border rounded-full shadow-lg p-2 pointer-events-auto flex gap-4 items-center pl-6 animate-in slide-in-from-bottom-10 fade-in fill-mode-both duration-500">
            <span className="text-sm font-medium hidden sm:inline">Klar med dina tips?</span>
            <Button onClick={handleSave} disabled={isSaving} className="rounded-full px-8 bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Tippa
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // --- DASHBOARD VIEW ---
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Tippa</h1>
        <p className="text-text-secondary">Välj en liga att tippa i.</p>
      </motion.div>

      {!hasLeagues ? (
        // EMPTY STATE
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-bg-subtle p-4 rounded-full mb-4">
                <Trophy className="h-8 w-8 text-text-tertiary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text-primary">Du är inte med i några ligor än</h3>
              <p className="text-text-secondary max-w-sm mb-6">
                För att kunna tippa måste du vara med i en liga.
              </p>
              <Button onClick={() => navigate('/leagues')}>
                Gå till Ligor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        // LEAGUE OPTIONS
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GLOBAL LEAGUE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className={`relative overflow-hidden transition-all hover:shadow-lg border-border-subtle h-full ${!globalLeague ? 'opacity-90' : ''}`}>
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Globe className="h-24 w-24" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-text-primary">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Globala Ligan
                </CardTitle>
                <CardDescription>
                  Tävla mot alla användare på plattformen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {globalLeague ? (
                  <Button className="w-full" onClick={() => handleLeagueSelect(globalLeague)}>
                    Tippa i Globala Ligan
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full" onClick={() => navigate('/dashboard/leagues')}>
                    Gå med i Globala Ligan
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* PRIVATE LEAGUES CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="relative overflow-hidden transition-all hover:shadow-lg border-border-subtle h-full">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Users className="h-24 w-24" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-text-primary">
                  <Users className="h-5 w-5 text-brand-500" />
                  Mina Ligor
                </CardTitle>
                <CardDescription>
                  Tippa i dina privata kompisligor.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Välj liga
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Välj Liga</DialogTitle>
                      <DialogDescription>
                        Välj vilken av dina privata ligor du vill tippa i.
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] mt-4 pr-4">
                      <div className="space-y-2">
                        {privateLeagues.length === 0 ? (
                          <div className="text-center py-8 text-text-tertiary">
                            Inga privata ligor hittades.
                          </div>
                        ) : (
                          privateLeagues.map(l => (
                            <DialogClose asChild key={l.id}>
                              <button
                                onClick={() => handleLeagueSelect(l)}
                                className="w-full text-left p-3 hover:bg-bg-subtle rounded-lg transition-colors flex items-center justify-between border border-border-subtle group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="bg-brand-100 text-brand-600 p-2 rounded-full group-hover:bg-brand-200 transition-colors">
                                    <Users className="w-4 h-4" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium truncate text-text-primary">{l.name}</span>
                                    <span className="text-xs text-text-tertiary">{l.memberCount || 0} medlemmar</span>
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-brand-500 transition-colors" />
                              </button>
                            </DialogClose>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

function DeadlineBanner({ settings, matches }: { settings: any, matches: MatchDto[] }) {
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [isLocked, setIsLocked] = useState(false)
  const [label, setLabel] = useState("")

  useEffect(() => {
    const calculateTime = () => {
      if (!matches.length) return

      const now = new Date()
      let targetDate: Date | null = null
      let currentLabel = ""

      if (settings.predictionMode === 'AllAtOnce') {
        // Find FIRST match date
        const sortedMatches = [...matches].sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())
        const firstMatch = sortedMatches[0]
        if (firstMatch) {
          const matchDate = new Date(firstMatch.matchDate)
          targetDate = new Date(matchDate.getTime() - (settings.deadlineMinutes || 0) * 60000)
          currentLabel = "Deadline för hela turneringen"
        }
      } else {
        // Per Match - Find NEXT locking match
        const sortedMatches = [...matches].sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())
        const nextMatch = sortedMatches.find(m => {
          const matchDate = new Date(m.matchDate)
          const lockDate = new Date(matchDate.getTime() - (settings.deadlineMinutes || 0) * 60000)
          return lockDate > now
        })

        if (nextMatch) {
          const matchDate = new Date(nextMatch.matchDate)
          targetDate = new Date(matchDate.getTime() - (settings.deadlineMinutes || 0) * 60000)
          currentLabel = "Nästa deadline"
        }
      }

      if (targetDate) {
        if (now > targetDate) {
          setIsLocked(true)
          setTimeLeft("Tiden ute")
        } else {
          setIsLocked(false)
          const diff = targetDate.getTime() - now.getTime()

          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)

          if (days > 0) setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
          else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
          else setTimeLeft(`${minutes}m ${seconds}s`)
        }
      } else {
        setTimeLeft("-")
      }
      setLabel(currentLabel)
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000) // Update every second
    return () => clearInterval(interval)
  }, [settings, matches])

  if (isLocked) {
    if (settings.predictionMode === 'AllAtOnce' && !settings.allowLateEdits) {
      return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 text-amber-800 mb-4">
          <Lock className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">Tippningen är låst. Deadline har passerat.</span>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-lg p-3 flex items-center justify-between gap-4 mb-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full">
          <Clock className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Tid kvar att tippa</span>
          <span className="text-sm font-medium text-indigo-900">{label}</span>
        </div>
      </div>
      <div className="text-xl font-bold font-mono text-indigo-600">
        {timeLeft}
      </div>
    </div>
  )
}
