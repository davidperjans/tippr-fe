import type { MatchDto } from '../../lib/api';
import { MatchStatus } from '../../lib/api';
import { TeamBadge } from '../team/TeamBadge';
import { StatusBadge } from '../common/StatusBadge';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface ScoreWidgetProps {
    match: MatchDto;
    className?: string;
}

export function ScoreWidget({ match, className }: ScoreWidgetProps) {
    // Safe defaults if team details are missing
    const homeTeam = {
        id: match.homeTeamId,
        name: match.homeTeamName,
        flagUrl: match.homeTeamLogoUrl,
        code: match.homeTeamName?.substring(0, 3).toUpperCase() || 'HOM',
        // Mock missing fields for TeamDto adherence if needed, or cast
    } as any;

    const awayTeam = {
        id: match.awayTeamId,
        name: match.awayTeamName,
        flagUrl: match.awayTeamLogoUrl,
        code: match.awayTeamName?.substring(0, 3).toUpperCase() || 'AWY',
    } as any;


    return (
        <div className={cn("bg-bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-sm", className)}>
            {/* Header */}
            <div className="bg-bg-subtle/30 px-4 py-2 border-b border-border-subtle flex justify-between items-center">
                <StatusBadge status={match.status} stage={match.stage} />
                <span className="text-xs text-text-tertiary">
                    {match.matchDate ? format(new Date(match.matchDate), 'd MMM HH:mm', { locale: sv }) : ''}
                </span>
            </div>

            {/* Score Board */}
            <div className="p-6">
                <div className="flex items-center justify-between">

                    {/* Home Team */}
                    <div className="flex flex-col items-center flex-1">
                        <TeamBadge team={homeTeam} size="xl" />
                        <span className="mt-3 font-semibold text-lg text-center leading-tight">
                            {match.homeTeamName}
                        </span>
                    </div>

                    {/* Score / VS */}
                    <div className="flex flex-col items-center px-4">
                        {match.status === MatchStatus.Scheduled ? (
                            <div className="text-3xl font-bold text-text-tertiary">VS</div>
                        ) : (
                            <div className="flex items-center gap-4 text-4xl font-bold text-text-primary tabular-nums">
                                <span>{match.homeScore ?? 0}</span>
                                <span className="text-text-tertiary">-</span>
                                <span>{match.awayScore ?? 0}</span>
                            </div>
                        )}
                        {match.venue && (
                            <span className="text-xs text-text-tertiary mt-2 text-center max-w-[150px] truncate">
                                {match.venue}
                            </span>
                        )}
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center flex-1">
                        <TeamBadge team={awayTeam} size="xl" />
                        <span className="mt-3 font-semibold text-lg text-center leading-tight">
                            {match.awayTeamName}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
}
