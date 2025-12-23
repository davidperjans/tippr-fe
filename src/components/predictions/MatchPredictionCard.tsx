import { type MatchDto, MatchStatus } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Check, RotateCcw, AlertCircle, Lock, Radio, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

interface MatchPredictionCardProps {
    match: MatchDto
    homeScore: string
    awayScore: string
    savedHomeScore?: string
    savedAwayScore?: string
    isFailed: boolean
    isLocked: boolean
    isSaving: boolean
    onChange: (field: 'home' | 'away', value: string) => void
    onClear: () => void
    onRetry?: () => void
    delay?: number
    earnedPoints?: number // Points earned for this prediction
}

export function MatchPredictionCard({
    match,
    homeScore,
    awayScore,
    savedHomeScore,
    savedAwayScore,
    isFailed,
    isLocked,
    isSaving,
    onChange,
    onClear,
    onRetry,
    delay = 0,
    earnedPoints
}: MatchPredictionCardProps) {
    const matchDate = new Date(match.matchDate)
    const isFinished = match.status === MatchStatus.Finished
    const isLive = match.status === MatchStatus.InProgress

    // Determine saved state
    const hasSavedValue = savedHomeScore !== undefined && savedAwayScore !== undefined
    const hasLocalValue = homeScore !== '' && awayScore !== ''
    const isDirty = hasSavedValue
        ? (homeScore !== savedHomeScore || awayScore !== savedAwayScore)
        : hasLocalValue

    // Calculate prediction result analysis (for finished matches)
    const predHome = hasSavedValue ? parseInt(savedHomeScore || '0') : null
    const predAway = hasSavedValue ? parseInt(savedAwayScore || '0') : null
    const actualHome = match.homeScore
    const actualAway = match.awayScore

    // Determine what's correct
    const hasResult = actualHome !== null && actualAway !== null && predHome !== null && predAway !== null
    const isExactScore = hasResult && predHome === actualHome && predAway === actualAway
    const homeGoalsCorrect = hasResult && predHome === actualHome
    const awayGoalsCorrect = hasResult && predAway === actualAway

    // Outcome prediction: 1 = home win, 2 = away win, x = draw
    const predOutcome = predHome !== null && predAway !== null
        ? (predHome > predAway ? '1' : predHome < predAway ? '2' : 'x')
        : null
    const actualOutcome = actualHome !== null && actualAway !== null
        ? (actualHome > actualAway ? '1' : actualAway > actualHome ? '2' : 'x')
        : null
    const outcomeCorrect = hasResult && predOutcome === actualOutcome

    // Feedback border for card
    let feedbackClass = ""
    if (isFinished && hasResult) {
        if (isExactScore) {
            feedbackClass = "border-l-4 border-l-success bg-success/5"
        } else if (outcomeCorrect) {
            feedbackClass = "border-l-4 border-l-warning bg-warning/5"
        } else {
            feedbackClass = "border-l-4 border-l-danger bg-danger/5"
        }
    }

    // Handle input change
    const handleChange = (field: 'home' | 'away', value: string) => {
        if (value === '' || /^[0-9]{1,2}$/.test(value)) {
            onChange(field, value)
        }
    }

    // Venue tooltip
    const venue = match.venue?.split(',')[0]?.trim() || ''

    return (
        <div className="space-y-0">
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay }}
                className={cn(
                    "px-2 py-1.5 rounded-lg border border-border-subtle bg-bg-surface/50",
                    "hover:bg-bg-surface transition-colors",
                    feedbackClass,
                    isFailed && "ring-1 ring-danger/50",
                    (isFinished || isLive) && (actualHome !== null) && "rounded-b-none"
                )}
                title={venue ? `${venue}` : undefined}
            >
                {/* Single Row - Fixed widths for consistency */}
                <div className="flex items-center gap-1">
                    {/* Time / Live Badge */}
                    <div className="w-11 shrink-0 text-[10px] text-center leading-tight">
                        {isLive ? (
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full animate-pulse">
                                    <Radio className="w-2 h-2" />
                                    LIVE
                                </span>
                            </div>
                        ) : (
                            <>
                                <div className="text-text-tertiary">{matchDate.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })}</div>
                                <div className="font-medium text-text-tertiary">{matchDate.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</div>
                            </>
                        )}
                    </div>

                    {/* Home Team */}
                    <div className="w-[100px] flex items-center gap-1 justify-end shrink-0">
                        <span className="text-xs font-medium text-text-primary truncate text-right" title={match.homeTeamName || ''}>
                            {match.homeTeamName}
                        </span>
                        {match.homeTeamLogoUrl ? (
                            <img src={match.homeTeamLogoUrl} className="w-4 h-4 object-contain shrink-0" alt="" />
                        ) : (
                            <div className="w-4 h-4 rounded bg-brand-100 flex items-center justify-center text-[8px] font-bold text-brand-600 shrink-0">
                                {(match.homeTeamName || 'H')[0]}
                            </div>
                        )}
                    </div>

                    {/* Score Inputs */}
                    <div className="flex items-center gap-0.5 shrink-0 mx-1">
                        <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className={cn(
                                "w-7 h-6 text-center text-xs font-bold rounded p-0",
                                "border transition-all",
                                isLocked
                                    ? "bg-bg-muted border-border-subtle cursor-not-allowed text-text-tertiary"
                                    : isDirty
                                        ? "border-brand-400 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300"
                                        : hasSavedValue
                                            ? "border-success/50 bg-success/10 text-success"
                                            : "border-border-default bg-bg-surface hover:border-brand-300 focus:border-brand-500 text-text-primary"
                            )}
                            value={homeScore}
                            onChange={(e) => handleChange('home', e.target.value)}
                            disabled={isLocked || isSaving}
                            placeholder="-"
                        />
                        <span className="text-text-tertiary text-[10px] px-0.5">-</span>
                        <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className={cn(
                                "w-7 h-6 text-center text-xs font-bold rounded p-0",
                                "border transition-all",
                                isLocked
                                    ? "bg-bg-muted border-border-subtle cursor-not-allowed text-text-tertiary"
                                    : isDirty
                                        ? "border-brand-400 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300"
                                        : hasSavedValue
                                            ? "border-success/50 bg-success/10 text-success"
                                            : "border-border-default bg-bg-surface hover:border-brand-300 focus:border-brand-500 text-text-primary"
                            )}
                            value={awayScore}
                            onChange={(e) => handleChange('away', e.target.value)}
                            disabled={isLocked || isSaving}
                            placeholder="-"
                        />
                    </div>

                    {/* Away Team */}
                    <div className="w-[100px] flex items-center gap-1 justify-start shrink-0">
                        {match.awayTeamLogoUrl ? (
                            <img src={match.awayTeamLogoUrl} className="w-4 h-4 object-contain shrink-0" alt="" />
                        ) : (
                            <div className="w-4 h-4 rounded bg-brand-100 flex items-center justify-center text-[8px] font-bold text-brand-600 shrink-0">
                                {(match.awayTeamName || 'A')[0]}
                            </div>
                        )}
                        <span className="text-xs font-medium text-text-primary truncate" title={match.awayTeamName || ''}>
                            {match.awayTeamName}
                        </span>
                    </div>

                    {/* Status indicator */}
                    <div className="w-6 shrink-0 flex justify-center">
                        {isFailed && onRetry ? (
                            <button onClick={onRetry} className="p-0.5 text-danger hover:bg-danger/10 rounded" title="Försök igen">
                                <AlertCircle className="w-3 h-3" />
                            </button>
                        ) : !isLocked && hasLocalValue && !isSaving ? (
                            <button onClick={onClear} className="p-0.5 text-text-tertiary hover:text-text-secondary rounded" title="Rensa">
                                <RotateCcw className="w-3 h-3" />
                            </button>
                        ) : isLocked && !isFinished && !isLive ? (
                            <Lock className="w-3 h-3 text-text-tertiary" />
                        ) : hasSavedValue && !isFinished && !isLive ? (
                            <Check className="w-3 h-3 text-success" />
                        ) : isDirty ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Utkast" />
                        ) : null}
                    </div>

                    {/* Link to match details */}
                    <Link
                        to={`/match/${match.id}`}
                        className="w-5 shrink-0 flex justify-center p-0.5 text-text-tertiary hover:text-brand-500 rounded transition-colors"
                        title="Visa matchinfo"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>
            </motion.div>

            {/* Result Row - Live or Finished */}
            {(isLive || isFinished) && actualHome !== null && actualAway !== null && (
                <div className={cn(
                    "px-3 py-2 rounded-b-lg border border-t-0 border-border-subtle -mt-px",
                    isLive ? "bg-red-50 dark:bg-red-900/10" : "bg-bg-subtle/50"
                )}>
                    <div className="flex items-center justify-center gap-3">
                        {/* Status Label - First */}
                        {isLive ? (
                            <span className="text-[10px] text-red-600 dark:text-red-400 font-medium uppercase">Pågår</span>
                        ) : (
                            <span className="text-[10px] text-text-tertiary">Slutresultat</span>
                        )}

                        {/* Result with color-coded prediction feedback */}
                        <div className="flex items-center gap-2">
                            {/* Home Score - green if predicted correctly */}
                            <div className={cn(
                                "w-6 h-6 flex items-center justify-center rounded text-sm font-bold",
                                isFinished && hasSavedValue && (
                                    homeGoalsCorrect
                                        ? "bg-success/20 text-success"
                                        : "bg-bg-muted text-text-primary"
                                ),
                                isLive && "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            )}>
                                {actualHome}
                            </div>
                            <span className="text-text-tertiary text-xs">-</span>
                            {/* Away Score - green if predicted correctly */}
                            <div className={cn(
                                "w-6 h-6 flex items-center justify-center rounded text-sm font-bold",
                                isFinished && hasSavedValue && (
                                    awayGoalsCorrect
                                        ? "bg-success/20 text-success"
                                        : "bg-bg-muted text-text-primary"
                                ),
                                isLive && "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            )}>
                                {actualAway}
                            </div>
                        </div>

                        {/* Outcome and Points badges */}
                        {isFinished && hasSavedValue && (
                            <>
                                {/* Outcome badge */}
                                <span className={cn(
                                    "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold",
                                    isExactScore
                                        ? "bg-success/20 text-success"
                                        : outcomeCorrect
                                            ? "bg-warning/20 text-warning"
                                            : "bg-danger/20 text-danger"
                                )}>
                                    {isExactScore ? "Exakt!" : outcomeCorrect ? "Rätt utgång" : "Fel utgång"}
                                </span>

                                {/* Points badge */}
                                {earnedPoints !== undefined && (
                                    <span className={cn(
                                        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold",
                                        earnedPoints > 0
                                            ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                                            : "bg-bg-muted text-text-tertiary"
                                    )}>
                                        +{earnedPoints} p
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
