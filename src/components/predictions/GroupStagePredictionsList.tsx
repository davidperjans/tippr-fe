import { useMemo } from "react"
import { type MatchDto, type LeagueSettingsDto } from "@/lib/api"
import { MatchPredictionCard } from "./MatchPredictionCard"
import { StandingsTable, type TeamStats } from "@/components/standings/StandingsTable"
import { ChevronDown, Trophy } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface GroupStagePredictionsListProps {
    matches: MatchDto[]
    localValues: Record<string, { home: string; away: string }>
    savedValues: Record<string, { home: string; away: string }>
    pointsEarned: Record<string, number | null>
    failedMatches: Set<string>
    isSaving: boolean
    leagueSettings?: LeagueSettingsDto
    onChange: (matchId: string, field: 'home' | 'away', value: string) => void
    onClear: (matchId: string) => void
    onRetry?: (matchId: string) => void
}

// Calculate live standings based on predictions
function calculateLiveStandings(
    matches: MatchDto[],
    predictions: Record<string, { home: string; away: string }>
): TeamStats[] {
    // Build team map
    const teamsMap: Record<string, TeamStats> = {}

    // Initialize teams from matches
    matches.forEach(match => {
        if (!teamsMap[match.homeTeamId]) {
            teamsMap[match.homeTeamId] = {
                id: match.homeTeamId,
                name: match.homeTeamName || 'Unknown',
                logoUrl: match.homeTeamLogoUrl,
                mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0
            }
        }
        if (!teamsMap[match.awayTeamId]) {
            teamsMap[match.awayTeamId] = {
                id: match.awayTeamId,
                name: match.awayTeamName || 'Unknown',
                logoUrl: match.awayTeamLogoUrl,
                mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0
            }
        }
    })

    // Process each match with prediction
    matches.forEach(match => {
        const prediction = predictions[match.id]
        if (!prediction || prediction.home === '' || prediction.away === '') return

        const homeScore = parseInt(prediction.home)
        const awayScore = parseInt(prediction.away)
        if (isNaN(homeScore) || isNaN(awayScore)) return

        const homeTeam = teamsMap[match.homeTeamId]
        const awayTeam = teamsMap[match.awayTeamId]

        // Update match count
        homeTeam.mp++
        awayTeam.mp++

        // Update goals
        homeTeam.gf += homeScore
        homeTeam.ga += awayScore
        awayTeam.gf += awayScore
        awayTeam.ga += homeScore

        // Update W/D/L and points
        if (homeScore > awayScore) {
            homeTeam.w++
            homeTeam.pts += 3
            awayTeam.l++
        } else if (homeScore < awayScore) {
            awayTeam.w++
            awayTeam.pts += 3
            homeTeam.l++
        } else {
            homeTeam.d++
            awayTeam.d++
            homeTeam.pts += 1
            awayTeam.pts += 1
        }
    })

    // Sort by points, then goal difference, then goals for
    return Object.values(teamsMap).sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts
        const gdA = a.gf - a.ga
        const gdB = b.gf - b.ga
        if (gdB !== gdA) return gdB - gdA
        return b.gf - a.gf
    })
}

export function GroupStagePredictionsList({
    matches,
    localValues,
    savedValues,
    pointsEarned,
    failedMatches,
    isSaving,
    leagueSettings,
    onChange,
    onClear,
    onRetry
}: GroupStagePredictionsListProps) {
    // Group matches by group name
    const groups: Record<string, MatchDto[]> = {}
    matches.forEach(match => {
        const groupName = match.groupName || "Övriga"
        if (!groups[groupName]) groups[groupName] = []
        groups[groupName].push(match)
    })

    // Sort groups alphabetically
    const sortedGroupNames = Object.keys(groups).sort()

    // Track collapsed state per group
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
    // Track if standings sidebar is visible (for mobile)
    const [showStandings, setShowStandings] = useState<Record<string, boolean>>({})

    const toggleGroup = (groupName: string) => {
        setCollapsedGroups(prev => {
            const newSet = new Set(prev)
            if (newSet.has(groupName)) {
                newSet.delete(groupName)
            } else {
                newSet.add(groupName)
            }
            return newSet
        })
    }

    const toggleStandings = (groupName: string) => {
        setShowStandings(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }))
    }

    // Check if match is locked based on settings
    const isMatchLocked = (match: MatchDto) => {
        const now = new Date()
        const matchDate = new Date(match.matchDate)

        // Always locked if match started or finished
        if (matchDate <= now || match.status !== 0) return true

        // Check deadline
        if (leagueSettings) {
            const deadlineMinutes = leagueSettings.deadlineMinutes || 0
            const lockTime = new Date(matchDate.getTime() - deadlineMinutes * 60000)
            if (now > lockTime && !leagueSettings.allowLateEdits) return true
        }

        return false
    }

    // Pre-calculate live standings for ALL groups at the component level (hooks must not be inside loops)
    const allGroupStandings = useMemo(() => {
        const result: Record<string, ReturnType<typeof calculateLiveStandings>> = {}
        sortedGroupNames.forEach(groupName => {
            const groupMatches = groups[groupName]
            result[groupName] = calculateLiveStandings(groupMatches, localValues)
        })
        return result
    }, [sortedGroupNames, groups, localValues])

    if (sortedGroupNames.length === 0) {
        return (
            <div className="text-center py-12 text-text-tertiary">
                Inga matcher i gruppspelet hittades.
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {sortedGroupNames.map((groupName, groupIndex) => {
                const groupMatches = groups[groupName]
                const isCollapsed = collapsedGroups.has(groupName)
                const isStandingsVisible = showStandings[groupName] !== false // Default to true

                // Count stats for this group
                const totalMatches = groupMatches.length
                const filledMatches = groupMatches.filter(m => {
                    const vals = localValues[m.id]
                    return vals && vals.home !== '' && vals.away !== ''
                }).length

                // Get pre-calculated live standings for this group (from allGroupStandings)
                const liveStandings = allGroupStandings[groupName] || []

                return (
                    <motion.div
                        key={groupName}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIndex * 0.05 }}
                        className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden"
                    >
                        {/* Group Header */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-brand-500/10 to-brand-600/5 border-b border-border-subtle">
                            <button
                                onClick={() => toggleGroup(groupName)}
                                className="flex-1 flex items-center gap-3 p-4 hover:bg-bg-subtle/30 transition-colors"
                            >
                                <ChevronDown
                                    className={cn(
                                        "w-5 h-5 text-text-tertiary transition-transform",
                                        isCollapsed && "-rotate-90"
                                    )}
                                />
                                <span className="text-lg font-bold text-text-primary">
                                    Grupp {groupName}
                                </span>
                                <span className="text-xs text-text-tertiary bg-bg-muted px-2 py-0.5 rounded-full">
                                    {filledMatches}/{totalMatches} tippade
                                </span>
                            </button>
                            {/* Toggle standings button (mobile) */}
                            <button
                                onClick={() => toggleStandings(groupName)}
                                className="xl:hidden p-4 hover:bg-bg-subtle/30 transition-colors border-l border-border-subtle/50"
                                title="Visa/dölj tabell"
                            >
                                <Trophy className={cn(
                                    "w-5 h-5",
                                    isStandingsVisible ? "text-brand-500" : "text-text-tertiary"
                                )} />
                            </button>
                        </div>

                        {/* Content */}
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-[3fr,2fr]">
                                        {/* Left: Match List */}
                                        <div className="p-4 space-y-3">
                                            {groupMatches.map((match, i) => {
                                                const values = localValues[match.id] || { home: '', away: '' }
                                                const saved = savedValues[match.id]

                                                return (
                                                    <MatchPredictionCard
                                                        key={match.id}
                                                        match={match}
                                                        homeScore={values.home}
                                                        awayScore={values.away}
                                                        savedHomeScore={saved?.home}
                                                        savedAwayScore={saved?.away}
                                                        earnedPoints={pointsEarned[match.id] ?? undefined}
                                                        isFailed={failedMatches.has(match.id)}
                                                        isLocked={isMatchLocked(match)}
                                                        isSaving={isSaving}
                                                        onChange={(field, value) => onChange(match.id, field, value)}
                                                        onClear={() => onClear(match.id)}
                                                        onRetry={onRetry ? () => onRetry(match.id) : undefined}
                                                        delay={i * 0.02}
                                                    />
                                                )
                                            })}
                                        </div>

                                        {/* Right: Live Standings Table */}
                                        <div className={cn(
                                            "p-4 bg-bg-subtle/30 border-t xl:border-t-0 xl:border-l border-border-subtle",
                                            !isStandingsVisible && "hidden xl:block"
                                        )}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Trophy className="w-4 h-4 text-brand-500" />
                                                <h4 className="font-semibold text-xs text-text-tertiary uppercase tracking-wider">
                                                    Live Tabell
                                                </h4>
                                            </div>
                                            {liveStandings.length > 0 ? (
                                                <StandingsTable
                                                    teams={liveStandings}
                                                    compact={true}
                                                    showQualification={true}
                                                />
                                            ) : (
                                                <div className="text-center py-8 text-text-tertiary text-sm">
                                                    Fyll i tippningar för att se tabellen
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )
            })}
        </div>
    )
}
