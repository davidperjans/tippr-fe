import React from 'react';
import { MatchDto } from '../../lib/api';
import { cn } from '../../lib/utils';
import { FormIndicator } from '../common/FormIndicator';

interface MatchStatsProps {
    match: MatchDto;
    className?: string;
}

export function MatchStats({ match, className }: MatchStatsProps) {
    // Mock stats since they aren't fully in MatchDto yet
    // In a real scenario, we'd fetch these or they'd be part of a detailed Match object
    const stats = {
        homeForm: 'WWDLW',
        awayForm: 'LDWWL',
        previousMeetings: 5,
        homeWins: 2,
        awayWins: 1,
        draws: 2
    };

    return (
        <div className={cn("grid md:grid-cols-2 gap-6", className)}>
            {/* Form */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Recent Form</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{match.homeTeamName}</span>
                        <FormIndicator form={stats.homeForm} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{match.awayTeamName}</span>
                        <FormIndicator form={stats.awayForm} />
                    </div>
                </div>
            </div>

            {/* Head-to-Head Mock */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Head-to-Head</h3>
                <div className="flex items-end justify-between px-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-text-primary">{stats.homeWins}</div>
                        <div className="text-xs text-text-tertiary">Wins</div>
                    </div>
                    <div className="text-center pb-1">
                        <div className="text-lg font-medium text-text-secondary">{stats.draws}</div>
                        <div className="text-xs text-text-tertiary">Draws</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-text-primary">{stats.awayWins}</div>
                        <div className="text-xs text-text-tertiary">Wins</div>
                    </div>
                </div>
                <div className="mt-4 relative h-2 bg-bg-subtle rounded-full overflow-hidden">
                    <div className="absolute left-0 h-full bg-brand-500" style={{ width: '40%' }}></div>
                    <div className="absolute right-0 h-full bg-info" style={{ width: '20%' }}></div>
                    {/* Middle is gray (draws) */}
                </div>
                <div className="flex justify-between text-[10px] text-text-tertiary mt-1">
                    <span>{match.homeTeamName}</span>
                    <span>{match.awayTeamName}</span>
                </div>
            </div>
        </div>
    );
}
