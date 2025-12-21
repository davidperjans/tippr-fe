import { format } from 'date-fns'
import { sv } from 'date-fns/locale'
import { type MatchDto, MatchStatus } from '../../lib/api'
import { cn } from '../../lib/utils'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'


interface MatchRowProps {
    match: MatchDto;
    showDate?: boolean;
    onBetClick?: (match: MatchDto) => void;
    variant?: 'default' | 'compact' | 'hero';
}

export function MatchRow({ match, showDate = true, onBetClick, variant = 'default' }: MatchRowProps) {
    const isFinished = match.status === MatchStatus.Finished
    const isLive = match.status === MatchStatus.InProgress // Assuming Ongoing exists, or just logic
    const date = new Date(match.matchDate)

    return (
        <div className={cn(
            "group relative flex items-center gap-4 p-4 border-b border-border-subtle bg-bg-surface hover:bg-bg-subtle/40 transition-colors last:border-0",
            variant === 'compact' && "p-2 gap-2 text-sm"
        )}>
            {/* Date / Time Column */}
            <div className="w-24 shrink-0 flex flex-col items-start justify-center">
                {showDate && (
                    <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider mb-0.5">
                        {format(date, 'd MMM', { locale: sv })}
                    </span>
                )}
                <span className="text-xs font-mono font-medium text-text-secondary">
                    {format(date, 'HH:mm')}
                </span>
            </div>

            {/* Match Content (Teams) */}
            <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8">
                {/* Home Team */}
                <div className="flex items-center justify-end gap-3 text-right">
                    <span className="hidden sm:inline font-semibold text-text-primary">{match.homeTeamName}</span>
                    <span className="sm:hidden font-semibold text-text-primary">{match.homeTeamName?.substring(0, 3).toUpperCase()}</span>
                    {match.homeTeamLogoUrl ? (
                        <img src={match.homeTeamLogoUrl} alt={match.homeTeamName || ''} className="w-8 h-8 object-contain" />
                    ) : (
                        <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-[10px] font-bold text-brand-700 uppercase">
                            {(match.homeTeamName || '?')[0]}
                        </div>
                    )}
                </div>

                {/* Score / VS Display */}
                <div className="w-16 flex items-center justify-center">
                    {isFinished ? (
                        <div className="flex items-center gap-1 font-mono text-lg font-bold text-text-primary bg-bg-subtle px-2 py-0.5 rounded-md">
                            <span>{match.homeScore ?? 0}</span>
                            <span className="text-text-tertiary">-</span>
                            <span>{match.awayScore ?? 0}</span>
                        </div>
                    ) : isLive ? (
                        <div className="px-2 py-0.5 bg-danger/10 text-danger text-xs font-bold rounded animate-pulse">
                            LIVE
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center text-xs font-medium text-text-tertiary">
                            VS
                        </div>
                    )}
                </div>

                {/* Away Team */}
                <div className="flex items-center justify-start gap-3 text-left">
                    {match.awayTeamLogoUrl ? (
                        <img src={match.awayTeamLogoUrl} alt={match.awayTeamName || ''} className="w-8 h-8 object-contain" />
                    ) : (
                        <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-[10px] font-bold text-brand-700 uppercase">
                            {(match.awayTeamName || '?')[0]}
                        </div>
                    )}
                    <span className="hidden sm:inline font-semibold text-text-primary">{match.awayTeamName}</span>
                    <span className="sm:hidden font-semibold text-text-primary">{match.awayTeamName?.substring(0, 3).toUpperCase()}</span>
                </div>
            </div>

            {/* Actions / Status (Right Side) */}
            <div className="w-24 shrink-0 flex items-center justify-end">
                {isFinished ? (
                    <Badge variant="secondary" className="bg-bg-subtle text-text-tertiary font-normal">Avslutad</Badge>
                ) : (
                    onBetClick ? (
                        <Button size="sm" variant="outline" className="h-8 rounded-full px-4 text-xs font-medium border-brand-200 text-brand-700 hover:bg-brand-50 hover:border-brand-300" onClick={() => onBetClick(match)}>
                            Tippa
                        </Button>
                    ) : (
                        <span className="text-xs text-text-tertiary font-medium">{match.groupName || 'Gruppspel'}</span>
                    )
                )}
            </div>
        </div>
    )
}
