import type { MatchDto } from '../../lib/api';
import { MatchStatus } from '../../lib/api';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FixturesWidgetProps {
    matches: MatchDto[];
    teamId: string; // To highlight result (W/L/D)
    className?: string;
}

export function FixturesWidget({ matches, teamId, className }: FixturesWidgetProps) {
    const upcoming = matches
        .filter(m => m.status === MatchStatus.Scheduled || m.status === MatchStatus.Postponed)
        .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());

    const past = matches
        .filter(m => m.status === MatchStatus.Finished || m.status === MatchStatus.InProgress)
        .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());

    const MatchCard = ({ match, type }: { match: MatchDto, type: 'upcoming' | 'past' }) => {
        const isHome = match.homeTeamId === teamId;

        // Result logic for past matches
        let resultClass = "";
        let resultLabel = "";
        if (type === 'past') {
            const myScore = isHome ? match.homeScore! : match.awayScore!;
            const opScore = isHome ? match.awayScore! : match.homeScore!;
            if (myScore > opScore) { resultClass = "text-success bg-success/10 border-success/20"; resultLabel = "W"; }
            else if (myScore < opScore) { resultClass = "text-danger bg-danger/10 border-danger/20"; resultLabel = "L"; }
            else { resultClass = "text-text-secondary bg-bg-subtle border-border-subtle"; resultLabel = "D"; }
        }

        return (
            <Link
                to={`/match/${match.id}`}
                className="group flex flex-col sm:flex-row items-center gap-4 p-4 bg-bg-surface border border-border-subtle rounded-xl hover:border-brand-300 hover:shadow-md transition-all relative overflow-hidden"
            >
                {/* Decoration Gradient */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-500 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Date Side (Desktop) */}
                <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-1 min-w-[100px] text-sm text-text-secondary">
                    <div className="flex items-center gap-2 font-medium text-text-primary">
                        <Calendar className="w-4 h-4 text-brand-500" />
                        {format(new Date(match.matchDate), 'd MMM', { locale: sv })}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[120px]" title={match.venue || ''}>{match.venue?.split(',')[0] || 'TBA'}</span>
                    </div>
                </div>

                {/* Matchup */}
                <div className="flex-1 flex items-center justify-between w-full sm:w-auto gap-4">
                    {/* Home Team */}
                    <div className="flex flex-1 items-center justify-end gap-3 text-right">
                        <span className={cn("font-semibold text-sm sm:text-base", match.homeTeamId === teamId && "text-brand-700")}>
                            {match.homeTeamName}
                        </span>
                        <img
                            src={match.homeTeamLogoUrl || ''}
                            alt={match.homeTeamName || ''}
                            className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-sm"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                    </div>

                    {/* Score / Time */}
                    <div className="flex flex-col items-center justify-center min-w-[60px] relative">
                        {type === 'past' ? (
                            <div className="flex flex-col items-center gap-1">
                                <div className="text-2xl font-bold font-mono leading-none tracking-tight">
                                    {match.homeScore} - {match.awayScore}
                                </div>
                                <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase", resultClass)}>
                                    {resultLabel}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1">
                                <div className="text-xl font-bold text-text-tertiary">VS</div>
                                <div className="text-xs font-mono bg-bg-subtle px-2 py-1 rounded text-text-secondary">
                                    {format(new Date(match.matchDate), 'HH:mm')}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-1 items-center justify-start gap-3 text-left">
                        <img
                            src={match.awayTeamLogoUrl || ''}
                            alt={match.awayTeamName || ''}
                            className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-sm"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                        <span className={cn("font-semibold text-sm sm:text-base", match.awayTeamId === teamId && "text-brand-700")}>
                            {match.awayTeamName}
                        </span>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div className={cn("space-y-8", className)}>
            {/* Upcoming */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-text-primary flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-brand-600" />
                        Kommande Matcher
                    </h3>
                </div>

                {upcoming.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-border-subtle rounded-xl bg-bg-subtle/30">
                        <p className="text-text-tertiary italic">Inga kommande matcher inplanerade.</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {upcoming.map(match => <MatchCard key={match.id} match={match} type="upcoming" />)}
                    </div>
                )}
            </div>

            {/* Past Results */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-text-primary flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-brand-600" />
                    Senaste Resultat
                </h3>
                {past.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-border-subtle rounded-xl bg-bg-subtle/30">
                        <p className="text-text-tertiary italic">Inga spelade matcher än.</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {past.map(match => <MatchCard key={match.id} match={match} type="past" />)}
                    </div>
                )}
            </div>
        </div>
    );
}
