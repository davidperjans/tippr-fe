import { type MatchDto } from "@/lib/api"
import { MatchPredictionCard } from "./MatchPredictionCard"
import { Trophy } from "lucide-react"
import { motion } from "framer-motion"

interface PlayoffsBracketProps {
    matches: MatchDto[]
    localValues: Record<string, { home: string; away: string }>
    savedValues: Record<string, { home: string; away: string }>
    failedMatches: Set<string>
    isSaving: boolean
    onChange: (matchId: string, field: 'home' | 'away', value: string) => void
    onClear: (matchId: string) => void
    onRetry?: (matchId: string) => void
}

// Match stages for playoffs
const STAGE_NAMES: Record<number, string> = {
    1: "Åttondelsfinaler",
    2: "Kvartsfinaler",
    3: "Semifinaler",
    4: "Final"
}

export function PlayoffsBracket({
    matches,
    localValues,
    savedValues,
    failedMatches,
    isSaving,
    onChange,
    onClear,
    onRetry
}: PlayoffsBracketProps) {
    // Group matches by stage (stage > 0 = playoffs)
    const playoffMatches = matches.filter(m => m.stage && m.stage > 0)

    // Group by stage number
    const stages: Record<number, MatchDto[]> = {}
    playoffMatches.forEach(match => {
        const stage = match.stage || 1
        if (!stages[stage]) stages[stage] = []
        stages[stage].push(match)
    })

    const sortedStages = Object.keys(stages).map(Number).sort((a, b) => a - b)

    // Show placeholder if no playoff matches available
    if (playoffMatches.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-surface border border-border-subtle rounded-2xl p-12 text-center"
            >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-2xl mb-4">
                    <Trophy className="w-8 h-8 text-brand-500" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Slutspelet öppnar snart
                </h3>
                <p className="text-sm text-text-tertiary max-w-md mx-auto">
                    Tippning för slutspelsmatcher blir tillgänglig när gruppspelet är avslutat.
                </p>
            </motion.div>
        )
    }

    return (
        <div className="space-y-8">
            {sortedStages.map((stageNum, stageIndex) => {
                const stageMatches = stages[stageNum]
                const stageName = STAGE_NAMES[stageNum] || `Omgång ${stageNum}`

                return (
                    <motion.div
                        key={stageNum}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: stageIndex * 0.1 }}
                        className="space-y-4"
                    >
                        {/* Stage Header */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-brand-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-text-primary">
                                    {stageName}
                                </h3>
                                <p className="text-xs text-text-tertiary">
                                    {stageMatches.length} {stageMatches.length === 1 ? 'match' : 'matcher'}
                                </p>
                            </div>
                        </div>

                        {/* Match Cards */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            {stageMatches.map((match, i) => {
                                const values = localValues[match.id] || { home: '', away: '' }
                                const saved = savedValues[match.id]
                                const matchDate = new Date(match.matchDate)
                                const now = new Date()
                                const isLocked = matchDate <= now || match.status !== 0

                                return (
                                    <MatchPredictionCard
                                        key={match.id}
                                        match={match}
                                        homeScore={values.home}
                                        awayScore={values.away}
                                        savedHomeScore={saved?.home}
                                        savedAwayScore={saved?.away}
                                        isFailed={failedMatches.has(match.id)}
                                        isLocked={isLocked}
                                        isSaving={isSaving}
                                        onChange={(field, value) => onChange(match.id, field, value)}
                                        onClear={() => onClear(match.id)}
                                        onRetry={onRetry ? () => onRetry(match.id) : undefined}
                                        delay={i * 0.05}
                                    />
                                )
                            })}
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}
