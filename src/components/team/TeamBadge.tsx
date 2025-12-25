import React from 'react';
import { Link } from 'react-router-dom';
import { TeamDto } from '../../lib/api';
import { cn } from '../../lib/utils';

interface TeamBadgeProps {
    team: TeamDto | null | undefined;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showName?: boolean;
    showRank?: boolean;
    className?: string;
}

export const getTeamDisplayName = (team: TeamDto): string => {
    return team.displayName ?? team.name ?? 'Unknown Team';
};

export function TeamBadge({
    team,
    size = 'md',
    showName = false,
    showRank = false,
    className
}: TeamBadgeProps) {
    if (!team) {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <div className={cn(
                    "bg-bg-subtle rounded-full flex items-center justify-center text-text-tertiary",
                    size === 'sm' && "w-6 h-6 text-[8px]",
                    size === 'md' && "w-8 h-8 text-[10px]",
                    size === 'lg' && "w-12 h-12 text-xs",
                    size === 'xl' && "w-16 h-16 text-sm"
                )}>
                    ?
                </div>
                {showName && <span className="text-text-secondary">Unknown</span>}
            </div>
        );
    }

    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16"
    };

    const textSizeClasses = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-lg font-semibold",
        xl: "text-2xl font-bold"
    };

    const content = (
        <>
            <div className="relative">
                {team.flagUrl || team.logoUrl || team.name ? (
                    <img
                        src={team.flagUrl || team.logoUrl || ''}
                        alt={team.name || ''}
                        className={cn("object-contain", sizeClasses[size])}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                ) : null}

                {/* Fallback if no image */}
                <div className={cn(
                    "bg-brand-50 rounded-full flex items-center justify-center text-brand-600 font-bold hidden border border-brand-100",
                    sizeClasses[size],
                    !(team.flagUrl || team.logoUrl) && "flex"
                )}>
                    {team.code?.substring(0, 2) || team.name?.substring(0, 1) || '?'}
                </div>

                {showRank && team.fifaRank && (
                    <div className="absolute -bottom-1 -right-2 bg-bg-surface border border-border-subtle text-[10px] text-text-secondary px-1 rounded-full shadow-sm whitespace-nowrap">
                        #{team.fifaRank}
                    </div>
                )}
            </div>

            {showName && (
                <span className={cn("text-text-primary group-hover:text-brand-600 transition-colors", textSizeClasses[size])}>
                    {getTeamDisplayName(team)}
                </span>
            )}
        </>
    );

    if (team.id) {
        return (
            <Link
                to={`/teams/${team.id}`}
                className={cn("flex flex-col items-center gap-2 group cursor-pointer hover:opacity-90 transition-opacity", showName && "text-center", className)}
            >
                {content}
            </Link>
        );
    }

    return (
        <div className={cn("flex flex-col items-center gap-2", showName && "text-center", className)}>
            {content}
        </div>
    );
}
