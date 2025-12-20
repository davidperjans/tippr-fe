import { Clock, TrendingUp, Flame, Zap } from 'lucide-react'

export function RightPulsePanel() {
    return (
        <aside className="hidden xl:flex w-60 flex-col border-l border-border-subtle bg-bg-surface sticky top-14 right-0" style={{ height: 'calc(100vh - 56px)' }}>
            {/* Header */}
            <div className="px-3 py-2 border-b border-border-subtle flex items-center gap-2 shrink-0">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-bold text-text-primary">Pulse</span>
            </div>

            {/* Content - Takes remaining space */}
            <div className="flex-1 p-2.5 flex flex-col gap-2.5 min-h-0">
                {/* Deadline */}
                <div className="shrink-0">
                    <h4 className="text-2xs font-semibold text-text-tertiary uppercase tracking-wider flex items-center gap-1 mb-1.5">
                        <Clock className="w-2.5 h-2.5" />
                        Deadline
                    </h4>
                    <div className="p-2 rounded-lg bg-warning/5 border border-warning/20 relative">
                        <div className="absolute top-0 left-0 w-0.5 h-full bg-warning rounded-r-full" />
                        <div className="pl-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-2xs font-semibold text-text-primary">Premier League</span>
                                <span className="text-2xs font-mono text-warning font-bold">2h 15m</span>
                            </div>
                            <p className="text-2xs text-text-tertiary truncate">Arsenal vs Liverpool</p>
                        </div>
                    </div>
                </div>

                {/* Live */}
                <div className="shrink-0">
                    <h4 className="text-2xs font-semibold text-text-tertiary uppercase tracking-wider flex items-center gap-1 mb-1.5">
                        <Flame className="w-2.5 h-2.5" />
                        Live
                    </h4>
                    <div className="space-y-1">
                        {[
                            { home: 'City', away: 'Chelsea', score: '2-1', minute: "78'" },
                            { home: 'Real', away: 'Barca', score: '1-1', minute: "45'" },
                        ].map((match, i) => (
                            <div key={i} className="flex items-center gap-1.5 p-1.5 rounded-md bg-bg-subtle/50">
                                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-2xs font-medium text-text-primary truncate">
                                        {match.home} <span className="text-brand-500">{match.score}</span> {match.away}
                                    </p>
                                </div>
                                <span className="text-2xs text-text-tertiary font-mono shrink-0">{match.minute}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="shrink-0">
                    <h4 className="text-2xs font-semibold text-text-tertiary uppercase tracking-wider flex items-center gap-1 mb-1.5">
                        <TrendingUp className="w-2.5 h-2.5" />
                        Veckan
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5">
                        <div className="p-1.5 rounded-md bg-bg-subtle/50 border border-border-subtle text-center">
                            <div className="text-sm font-bold text-brand-500">+24</div>
                            <div className="text-2xs text-text-tertiary">Poäng</div>
                        </div>
                        <div className="p-1.5 rounded-md bg-bg-subtle/50 border border-border-subtle text-center">
                            <div className="text-sm font-bold text-success">↑2</div>
                            <div className="text-2xs text-text-tertiary">Rank</div>
                        </div>
                    </div>
                </div>

                {/* Ligastatus - Footer */}
                <div className="mt-auto shrink-0 p-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
                    <div className="flex items-center gap-1 mb-0.5">
                        <TrendingUp className="w-3 h-3 text-brand-500" />
                        <span className="text-2xs font-semibold text-text-primary">Ligastatus</span>
                    </div>
                    <p className="text-2xs text-text-secondary">
                        <span className="text-success font-bold">+2</span> placeringar!
                    </p>
                </div>
            </div>
        </aside>
    )
}
