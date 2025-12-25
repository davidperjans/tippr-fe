import React, { useState } from 'react';
import { PlayerDto } from '../../lib/api';
import { cn } from '../../lib/utils';
import { Users, Shield, Footprints, Target, Hand } from 'lucide-react'; // Swapped custom icon names for best Lucide approximations

interface SquadWidgetProps {
    players: PlayerDto[];
    className?: string;
}

const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];
const POSITION_LABELS: Record<string, string> = {
    'Goalkeeper': 'Målvakter',
    'Defender': 'Försvarare',
    'Midfielder': 'Mittfältare',
    'Attacker': 'Anfallare'
};

// Map positions to icons
const POSITION_ICONS: Record<string, React.ElementType> = {
    'Goalkeeper': Hand, // Or Shield
    'Defender': Shield,
    'Midfielder': Footprints, // Abstract for movement
    'Attacker': Target
};

export function SquadWidget({ players, className }: SquadWidgetProps) {
    const [filter, setFilter] = useState<string>('All');

    const normalizePosition = (pos?: string) => {
        if (!pos) return 'Unknown';
        if (pos.includes('Goal')) return 'Goalkeeper';
        if (pos.includes('Def')) return 'Defender';
        if (pos.includes('Mid')) return 'Midfielder';
        if (pos.includes('Att') || pos.includes('Forw')) return 'Attacker';
        return pos;
    }

    const filteredPlayers = filter === 'All'
        ? players
        : players.filter(p => normalizePosition(p.position) === filter);

    const sortPlayers = (list: PlayerDto[]) => {
        return list.sort((a, b) => {
            const posA = normalizePosition(a.position);
            const posB = normalizePosition(b.position);
            const indexA = POSITIONS.indexOf(posA);
            const indexB = POSITIONS.indexOf(posB);

            if (indexA !== indexB) return indexA - indexB;
            return (a.number || 99) - (b.number || 99);
        });
    };

    const groupedPlayers = filter === 'All'
        ? POSITIONS.map(pos => ({
            position: pos,
            players: sortPlayers(players.filter(p => normalizePosition(p.position) === pos))
        })).filter(g => g.players.length > 0)
        : [{ position: filter, players: sortPlayers(filteredPlayers) }];


    return (
        <div className={cn("space-y-6", className)}>
            {/* Filter Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                {['All', ...POSITIONS].map((pos) => {
                    const Icon = POSITION_ICONS[pos];
                    return (
                        <button
                            key={pos}
                            onClick={() => setFilter(pos)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-2",
                                filter === pos
                                    ? "bg-brand-600 text-white shadow-sm"
                                    : "bg-bg-subtle text-text-secondary hover:bg-bg-surface border border-border-subtle"
                            )}
                        >
                            {Icon && <Icon className="w-3 h-3" />}
                            {pos === 'All' ? 'Alla' : POSITION_LABELS[pos] || pos}
                        </button>
                    )
                })}
            </div>

            <div className="space-y-8">
                {groupedPlayers.map((group) => {
                    const GroupIcon = POSITION_ICONS[group.position] || Users;
                    return (
                        <div key={group.position} className="space-y-4">
                            {filter === 'All' && (
                                <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
                                    <GroupIcon className="w-4 h-4 text-brand-600" />
                                    <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                        {POSITION_LABELS[group.position] || group.position}
                                    </span>
                                    <span className="text-xs text-text-tertiary bg-bg-subtle px-1.5 rounded-full">{group.players.length}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {group.players.map(player => (
                                    <div key={player.id} className="flex items-center gap-4 bg-bg-surface p-3 rounded-xl border border-border-subtle hover:border-brand-200 hover:shadow-sm transition-all group">
                                        {/* Photo */}
                                        <div className="w-12 h-12 rounded-full bg-bg-subtle overflow-hidden flex-shrink-0 border border-border-subtle relative group-hover:border-brand-200 transition-colors">
                                            {player.photoUrl ? (
                                                <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                                                    <Users className="w-5 h-5 opacity-50" />
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 right-0 bg-brand-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-tl-lg">
                                                {player.number || '-'}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-text-primary truncate">{player.name}</div>
                                            <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                                                {player.age && <span>{player.age} år</span>}
                                                {player.nationality && (
                                                    <>
                                                        <span className="text-border-subtle">•</span>
                                                        <span>{player.nationality}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Icon */}
                                        {player.injured && (
                                            <div className="text-danger flex items-center justify-center w-8 h-8 rounded-full bg-danger/10" title="Skadad">
                                                <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
                {groupedPlayers.length === 0 && (
                    <div className="text-center py-12 text-text-tertiary flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 opacity-20" />
                        <span>Inga spelare hittades.</span>
                    </div>
                )}
            </div>
        </div>
    );
}
