import { type MatchDto, MatchStatus } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Check, RotateCcw, AlertCircle, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

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
    delay = 0
}: MatchPredictionCardProps) {
    const matchDate = new Date(match.matchDate)
    const isFinished = match.status === MatchStatus.Finished

    // Determine saved state
    const hasSavedValue = savedHomeScore !== undefined && savedAwayScore !== undefined
    const hasLocalValue = homeScore !== '' && awayScore !== ''
    const isDirty = hasSavedValue
        ? (homeScore !== savedHomeScore || awayScore !== savedAwayScore)
        : hasLocalValue

    // Feedback for finished matches
    let feedbackClass = ""
    if (isFinished && hasSavedValue && match.homeScore !== null && match.awayScore !== null) {
        const predHome = parseInt(savedHomeScore || '0')
        const predAway = parseInt(savedAwayScore || '0')
        if (predHome === match.homeScore && predAway === match.awayScore) {
            feedbackClass = "border-l-2 border-l-success bg-success/5"
        } else {
            const predRes = predHome > predAway ? '1' : predHome < predAway ? '2' : 'x'
            const actRes = match.homeScore > match.awayScore ? '1' : match.awayScore > match.homeScore ? '2' : 'x'
            if (predRes === actRes) {
                feedbackClass = "border-l-2 border-l-warning bg-warning/5"
            } else {
                feedbackClass = "border-l-2 border-l-danger bg-danger/5"
            }
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
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={cn(
                "px-2 py-1.5 rounded-lg border border-border-subtle bg-bg-surface/50",
                "hover:bg-bg-surface transition-colors",
                feedbackClass,
                isFailed && "ring-1 ring-danger/50"
            )}
            title={venue ? `${venue}` : undefined}
        >
            {/* Single Row - Fixed widths for consistency */}
            <div className="flex items-center gap-1">
                {/* Time - Compact */}
                <div className="w-11 shrink-0 text-[10px] text-text-tertiary text-center leading-tight">
                    <div>{matchDate.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })}</div>
                    <div className="font-medium">{matchDate.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>

                {/* Home Team - Wider for full names */}
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

                {/* Score Inputs - Center, fixed */}
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

                {/* Away Team - Wider for full names */}
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

                {/* Status - Fixed width, right side */}
                <div className="w-6 shrink-0 flex justify-center">
                    {isFailed && onRetry ? (
                        <button onClick={onRetry} className="p-0.5 text-danger hover:bg-danger/10 rounded" title="Försök igen">
                            <AlertCircle className="w-3 h-3" />
                        </button>
                    ) : !isLocked && hasLocalValue && !isSaving ? (
                        <button onClick={onClear} className="p-0.5 text-text-tertiary hover:text-text-secondary rounded" title="Rensa">
                            <RotateCcw className="w-3 h-3" />
                        </button>
                    ) : isLocked ? (
                        <Lock className="w-3 h-3 text-text-tertiary" />
                    ) : hasSavedValue ? (
                        <Check className="w-3 h-3 text-success" />
                    ) : isDirty ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Utkast" />
                    ) : null}
                </div>
            </div>
        </motion.div>
    )
}
