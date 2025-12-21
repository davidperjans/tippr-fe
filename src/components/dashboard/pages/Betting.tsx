import { useState, useEffect, useCallback, useMemo } from "react"
import { useLeagues, useMatches, usePredictions, useSubmitPrediction, useUpdatePrediction } from "@/hooks/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, ArrowRight, Globe, Lock, Clock, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { LeagueDto, MatchDto } from "@/lib/api"
import { toast } from "react-hot-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

// New components
import { StickySaveBar } from "@/components/predictions/StickySaveBar"
import { GroupStagePredictionsList } from "@/components/predictions/GroupStagePredictionsList"
import { PlayoffsBracket } from "@/components/predictions/PlayoffsBracket"

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

export function Betting({ preselectedLeagueId }: { preselectedLeagueId?: string } = {}) {
  const navigate = useNavigate()
  const { data: leagues, isLoading } = useLeagues()
  const [selectedLeague, setSelectedLeague] = useState<LeagueDto | null>(null)
  const [view, setView] = useState<'dashboard' | 'betting'>(preselectedLeagueId ? 'betting' : 'dashboard')
  const [activeTab, setActiveTab] = useState<'groups' | 'playoffs'>('groups')

  // Auto-select preselected league when data loads
  useEffect(() => {
    if (preselectedLeagueId && leagues && !selectedLeague) {
      const league = leagues.find(l => l.id === preselectedLeagueId)
      if (league) {
        setSelectedLeague(league)
        setView('betting')
      }
    }
  }, [preselectedLeagueId, leagues, selectedLeague])

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
  const { data: predictions, refetch: refetchPredictions } = usePredictions(selectedLeague?.id)
  const submitPrediction = useSubmitPrediction()
  const updatePrediction = useUpdatePrediction()

  // State: saved values from API (includes prediction ID for updates)
  const [savedPredictions, setSavedPredictions] = useState<Record<string, { id: string; home: string; away: string }>>({})
  // State: local edits
  const [localValues, setLocalValues] = useState<Record<string, { home: string; away: string }>>({})
  // State: failed saves
  const [failedMatches, setFailedMatches] = useState<Set<string>>(new Set())
  // State: saving in progress
  const [isSaving, setIsSaving] = useState(false)

  // Initialize values from API predictions
  useEffect(() => {
    if (predictions && matches) {
      const initialPredictions: Record<string, { id: string; home: string; away: string }> = {}
      const initialLocal: Record<string, { home: string; away: string }> = {}
      predictions.forEach(p => {
        initialPredictions[p.matchId] = {
          id: p.id,
          home: p.homeScore.toString(),
          away: p.awayScore.toString()
        }
        initialLocal[p.matchId] = {
          home: p.homeScore.toString(),
          away: p.awayScore.toString()
        }
      })
      setSavedPredictions(initialPredictions)
      setLocalValues(initialLocal)
      setFailedMatches(new Set())
    }
  }, [predictions, matches])

  // Handle input change
  const handleInputChange = useCallback((matchId: string, field: 'home' | 'away', value: string) => {
    setLocalValues(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId] || { home: '', away: '' },
        [field]: value
      }
    }))
  }, [])

  // Handle clear
  const handleClear = useCallback((matchId: string) => {
    setLocalValues(prev => ({
      ...prev,
      [matchId]: { home: '', away: '' }
    }))
  }, [])

  // Calculate dirty matches
  const dirtyMatches = useMemo(() => {
    const dirty = new Set<string>()
    Object.entries(localValues).forEach(([matchId, values]) => {
      const saved = savedPredictions[matchId]
      const hasValues = values.home !== '' && values.away !== ''

      if (hasValues) {
        if (!saved || saved.home !== values.home || saved.away !== values.away) {
          dirty.add(matchId)
        }
      }
    })
    return dirty
  }, [localValues, savedPredictions])

  // Derive savedValues for child components (without id field)
  const savedValues = useMemo(() => {
    const values: Record<string, { home: string; away: string }> = {}
    Object.entries(savedPredictions).forEach(([matchId, pred]) => {
      values[matchId] = { home: pred.home, away: pred.away }
    })
    return values
  }, [savedPredictions])

  // Check if all group stage matches are filled
  const groupMatches = useMemo(() =>
    matches?.filter(m => m.stage === 0) || [],
    [matches]
  )

  const allGroupsFilled = useMemo(() => {
    if (groupMatches.length === 0) return false
    return groupMatches.every(m => {
      const vals = localValues[m.id]
      return vals && vals.home !== '' && vals.away !== ''
    })
  }, [groupMatches, localValues])

  // Save changes
  const handleSave = async () => {
    if (!selectedLeague || dirtyMatches.size === 0) return
    setIsSaving(true)
    setFailedMatches(new Set())

    const promises = Array.from(dirtyMatches).map(async (matchId) => {
      const scores = localValues[matchId]
      if (!scores || scores.home === '' || scores.away === '') {
        return { matchId, success: true, predictionId: null }
      }

      const existingPrediction = savedPredictions[matchId]

      try {
        if (existingPrediction) {
          // UPDATE existing prediction with PUT
          await updatePrediction.mutateAsync({
            id: existingPrediction.id,
            homeScore: parseInt(scores.home),
            awayScore: parseInt(scores.away),
            leagueId: selectedLeague.id
          })
          return { matchId, success: true, predictionId: existingPrediction.id }
        } else {
          // CREATE new prediction with POST
          const newId = await submitPrediction.mutateAsync({
            leagueId: selectedLeague.id,
            matchId,
            homeScore: parseInt(scores.home),
            awayScore: parseInt(scores.away)
          })
          return { matchId, success: true, predictionId: newId }
        }
      } catch (error) {
        return { matchId, success: false, predictionId: existingPrediction?.id || null }
      }
    })

    const results = await Promise.allSettled(promises)

    const failed = new Set<string>()
    const succeeded = new Set<string>()

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        if (result.value.success) {
          succeeded.add(result.value.matchId)
        } else {
          failed.add(result.value.matchId)
        }
      }
    })

    // Update saved predictions for successful saves
    if (succeeded.size > 0) {
      setSavedPredictions(prev => {
        const newSaved = { ...prev }
        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value.success) {
            const { matchId, predictionId } = result.value
            newSaved[matchId] = {
              id: predictionId || prev[matchId]?.id || '',
              ...localValues[matchId]
            }
          }
        })
        return newSaved
      })
    }

    setFailedMatches(failed)
    setIsSaving(false)

    if (failed.size === 0) {
      toast.success("Tippningar sparade")
      refetchPredictions()
    } else if (failed.size < dirtyMatches.size) {
      toast.error("Vissa matcher kunde inte sparas")
    } else {
      toast.error("Kunde inte spara tippningarna")
    }
  }

  // Revert all changes
  const handleRevert = useCallback(() => {
    const revertedLocal: Record<string, { home: string; away: string }> = {}
    Object.entries(savedPredictions).forEach(([matchId, pred]) => {
      revertedLocal[matchId] = { home: pred.home, away: pred.away }
    })
    setLocalValues(revertedLocal)
    setFailedMatches(new Set())
  }, [savedPredictions])

  // Go to playoffs
  const handleGoToPlayoffs = async () => {
    // If there are unsaved changes, save them first
    if (dirtyMatches.size > 0) {
      await handleSave()
    }
    setActiveTab('playoffs')
  }

  // Retry failed match
  const handleRetry = async (matchId: string) => {
    if (!selectedLeague) return
    const scores = localValues[matchId]
    if (!scores || scores.home === '' || scores.away === '') return

    const existingPrediction = savedPredictions[matchId]

    try {
      let predictionId: string
      if (existingPrediction) {
        // UPDATE existing prediction with PUT
        await updatePrediction.mutateAsync({
          id: existingPrediction.id,
          homeScore: parseInt(scores.home),
          awayScore: parseInt(scores.away),
          leagueId: selectedLeague.id
        })
        predictionId = existingPrediction.id
      } else {
        // CREATE new prediction with POST
        predictionId = await submitPrediction.mutateAsync({
          leagueId: selectedLeague.id,
          matchId,
          homeScore: parseInt(scores.home),
          awayScore: parseInt(scores.away)
        })
      }

      setFailedMatches(prev => {
        const newSet = new Set(prev)
        newSet.delete(matchId)
        return newSet
      })

      setSavedPredictions(prev => ({
        ...prev,
        [matchId]: { id: predictionId, ...scores }
      }))

      toast.success("Tippning sparad")
    } catch {
      toast.error("Kunde inte spara")
    }
  }

  // Check if predictions are locked
  const isLocked = useMemo(() => {
    if (!selectedLeague?.settings || !matches?.length) return false

    const settings = selectedLeague.settings
    if (settings.predictionMode === 'AllAtOnce') {
      const sortedMatches = [...matches].sort((a, b) =>
        new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
      )
      const firstMatch = sortedMatches[0]
      if (firstMatch) {
        const matchDate = new Date(firstMatch.matchDate)
        const lockDate = new Date(matchDate.getTime() - (settings.deadlineMinutes || 0) * 60000)
        if (new Date() > lockDate && !settings.allowLateEdits) {
          return true
        }
      }
    }
    return false
  }, [selectedLeague, matches])

  // Playoff matches
  const playoffMatches = useMemo(() =>
    matches?.filter(m => m.stage && m.stage > 0) || [],
    [matches]
  )

  if (isLoading) return <BettingSkeleton />

  // --- BETTING VIEW ---
  if (view === 'betting' && selectedLeague) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
        {/* Header - only show when NOT in league context (preselected) */}
        {!preselectedLeagueId && (
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="shrink-0 mt-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                  {selectedLeague.name}
                </h1>
                {isLocked && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded-full">
                    <Lock className="w-3 h-3" />
                    Tippningen är låst
                  </span>
                )}
              </div>
              <p className="text-text-secondary mt-1">
                Fyll i dina tips för kommande matcher
              </p>
            </div>
          </div>
        )}

        {/* Lock badge when preselected */}
        {preselectedLeagueId && isLocked && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Tippningen är låst
            </span>
          </div>
        )}

        {/* Deadline Banner */}
        {matches && matches.length > 0 && !isLocked && (
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

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'groups' | 'playoffs')}
          className="w-full"
        >
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6 mb-6">
            <TabsTrigger
              value="groups"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:bg-transparent data-[state=active]:text-brand-600 px-0 py-3 font-semibold"
            >
              Gruppspel
            </TabsTrigger>
            <TabsTrigger
              value="playoffs"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:bg-transparent data-[state=active]:text-brand-600 px-0 py-3 font-semibold"
            >
              Slutspel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="mt-0">
            <GroupStagePredictionsList
              matches={groupMatches}
              localValues={localValues}
              savedValues={savedValues}
              failedMatches={failedMatches}
              isSaving={isSaving}
              leagueSettings={selectedLeague.settings}
              onChange={handleInputChange}
              onClear={handleClear}
              onRetry={handleRetry}
            />
          </TabsContent>

          <TabsContent value="playoffs" className="mt-0">
            <PlayoffsBracket
              matches={playoffMatches}
              localValues={localValues}
              savedValues={savedValues}
              failedMatches={failedMatches}
              isSaving={isSaving}
              onChange={handleInputChange}
              onClear={handleClear}
              onRetry={handleRetry}
            />
          </TabsContent>
        </Tabs>

        {/* Sticky Save Bar */}
        <StickySaveBar
          hasChanges={dirtyMatches.size > 0}
          allGroupsFilled={allGroupsFilled && dirtyMatches.size === 0}
          isSaving={isSaving}
          onSave={handleSave}
          onRevert={handleRevert}
          onGoToPlayoffs={handleGoToPlayoffs}
          isLocked={isLocked}
          activeTab={activeTab}
        />
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
                  <Button variant="secondary" className="w-full" onClick={() => navigate('/leagues')}>
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

// Deadline Banner Component
function DeadlineBanner({ settings, matches }: { settings: any, matches: MatchDto[] }) {
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [label, setLabel] = useState("")

  useEffect(() => {
    const calculateTime = () => {
      if (!matches.length) return

      const now = new Date()
      let targetDate: Date | null = null
      let currentLabel = ""

      if (settings.predictionMode === 'AllAtOnce') {
        const sortedMatches = [...matches].sort((a, b) =>
          new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
        )
        const firstMatch = sortedMatches[0]
        if (firstMatch) {
          const matchDate = new Date(firstMatch.matchDate)
          targetDate = new Date(matchDate.getTime() - (settings.deadlineMinutes || 0) * 60000)
          currentLabel = "Deadline för hela turneringen"
        }
      } else {
        const sortedMatches = [...matches].sort((a, b) =>
          new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
        )
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

      if (targetDate && targetDate > now) {
        const diff = targetDate.getTime() - now.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        if (days > 0) setTimeLeft(`${days}d ${hours}h ${minutes}m`)
        else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
        else setTimeLeft(`${minutes}m ${seconds}s`)
      } else {
        setTimeLeft("-")
      }
      setLabel(currentLabel)
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000)
    return () => clearInterval(interval)
  }, [settings, matches])

  if (!timeLeft || timeLeft === "-") return null

  return (
    <div className="bg-gradient-to-r from-brand-50 to-brand-100/50 dark:from-brand-900/20 dark:to-brand-800/10 border border-brand-200 dark:border-brand-800/30 rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 p-2.5 rounded-xl">
          <Clock className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-text-tertiary font-semibold">
            {label}
          </span>
          <span className="text-sm font-medium text-text-primary">
            Tid kvar att tippa
          </span>
        </div>
      </div>
      <div className="text-2xl font-bold font-mono text-brand-600 dark:text-brand-400">
        {timeLeft}
      </div>
    </div>
  )
}
