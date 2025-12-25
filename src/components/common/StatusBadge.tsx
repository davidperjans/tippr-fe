import React from 'react';
import { MatchStatus, MatchStage } from '../../lib/api';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
    status: MatchStatus;
    stage?: MatchStage;
    className?: string;
    pulsate?: boolean;
}

export const getStatusDisplay = (status: MatchStatus): { text: string; color: string; bg: string } => {
    switch (status) {
        case MatchStatus.Scheduled:
            return { text: 'Upcoming', color: 'text-info', bg: 'bg-info/10' };
        case MatchStatus.InProgress:
            return { text: 'LIVE', color: 'text-danger', bg: 'bg-danger/10' };
        case MatchStatus.Finished:
            return { text: 'FT', color: 'text-text-secondary', bg: 'bg-bg-subtle' };
        case MatchStatus.Postponed:
            return { text: 'Postponed', color: 'text-warning', bg: 'bg-warning/10' };
        case MatchStatus.Cancelled:
            return { text: 'Cancelled', color: 'text-text-tertiary', bg: 'bg-bg-subtle' };
        default:
            return { text: 'Unknown', color: 'text-text-tertiary', bg: 'bg-bg-subtle' };
    }
};

export const getStageDisplay = (stage: MatchStage): string => {
    switch (stage) {
        case MatchStage.Group: return 'Group Stage';
        case MatchStage.RoundOf16: return 'Round of 16';
        case MatchStage.QuarterFinal: return 'Quarter Final';
        case MatchStage.SemiFinal: return 'Semi Final';
        case MatchStage.Final: return 'Final';
        default: return '';
    }
}


export function StatusBadge({ status, stage, className, pulsate = true }: StatusBadgeProps) {
    const { text, color, bg } = getStatusDisplay(status);
    const isLive = status === MatchStatus.InProgress;

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium border border-transparent flex items-center gap-1.5",
                color,
                bg
            )}>
                {isLive && pulsate && (
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
                    </span>
                )}
                {text}
            </div>
            {stage !== undefined && (
                <span className="text-xs text-text-tertiary font-medium">
                    {getStageDisplay(stage)}
                </span>
            )}
        </div>
    );
}
