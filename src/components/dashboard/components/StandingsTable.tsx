import { cn } from "@/lib/utils"

export interface TeamStats {
    id: string;
    name: string;
    logoUrl: string | null;
    mp: number;
    w: number;
    d: number;
    l: number;
    gf: number;
    ga: number;
    pts: number;
}

interface StandingsTableProps {
    standings: TeamStats[];
    className?: string;
    compact?: boolean;
}

export function StandingsTable({ standings, className, compact = false }: StandingsTableProps) {
    return (
        <div className={cn("overflow-x-auto", className)}>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b text-muted-foreground text-xs uppercase tracking-wider">
                        <th className="pb-2 pl-2 font-medium w-6">#</th>
                        <th className="pb-2 pl-2 font-medium">Lag</th>
                        <th className="pb-2 text-center font-medium" title="Matcher Spelade">M</th>
                        {!compact && (
                            <>
                                <th className="pb-2 text-center font-medium" title="Vunna">V</th>
                                <th className="pb-2 text-center font-medium" title="Oavgjorda">O</th>
                                <th className="pb-2 text-center font-medium" title="Förlorade">F</th>
                            </>
                        )}
                        <th className="pb-2 text-center font-medium" title="Målskillnad">+/-</th>
                        <th className="pb-2 text-right pr-2 font-bold" title="Poäng">P</th>
                    </tr>
                </thead>
                <tbody className="divide-y relative">
                    {standings.map((team, idx) => {
                        const totalTeams = standings.length

                        // Qualification Logic: Left Border
                        let rowClass = "hover:bg-muted/30 relative"
                        let indicatorConfig = "border-l-4"

                        if (idx === 0 || idx === 1) {
                            // 1st and 2nd place - green (always)
                            indicatorConfig = "border-l-4 border-green-500"
                        } else if (idx === 2) {
                            // 3rd place - blue (always)
                            indicatorConfig = "border-l-4 border-blue-500"
                        } else {
                            // 4th place or more - no border
                            indicatorConfig = "border-l-4 border-transparent"
                        }

                        // Zone Separators: Apply colored border-top to the row AFTER the separator
                        let separatorClass = ""

                        // Only apply complex separators if we are NOT in compact mode (or keep consistent?)
                        // User wanted EXACT design, so keeping it.

                        // Keep gray line ABOVE 2nd place (idx 1) - explicit gray
                        if (idx === 1) {
                            separatorClass = "!border-t-border"
                        }
                        // Green line ABOVE 3rd place (idx 2)
                        else if (idx === 2) {
                            separatorClass = "!border-t-green-500"
                        }
                        // Blue line ABOVE 4th place (idx 3) - only if 4 teams
                        else if (idx === 3 && totalTeams > 3) {
                            separatorClass = "!border-t-blue-500"
                        }

                        return (
                            <tr key={team.id} className={cn(rowClass, indicatorConfig, separatorClass)}>
                                <td className="py-2 pl-2 text-xs text-muted-foreground w-6">{idx + 1}</td>
                                <td className="py-2 pl-2 flex items-center gap-2">
                                    {team.logoUrl && <img src={team.logoUrl} className="w-5 h-5 object-contain" alt="" />}
                                    <span className="font-medium truncate max-w-[100px] sm:max-w-[150px]">{team.name}</span>
                                </td>
                                <td className="py-2 text-center">{team.mp}</td>
                                {!compact && (
                                    <>
                                        <td className="py-2 text-center text-muted-foreground">{team.w}</td>
                                        <td className="py-2 text-center text-muted-foreground">{team.d}</td>
                                        <td className="py-2 text-center text-muted-foreground">{team.l}</td>
                                    </>
                                )}
                                <td className="py-2 text-center text-muted-foreground">
                                    {team.gf - team.ga > 0 ? '+' : ''}{team.gf - team.ga}
                                </td>
                                <td className="py-2 text-right pr-2 font-bold">{team.pts}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            {!compact && (
                <div className="mt-4 flex gap-4 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <div className="w-1 h-3 bg-green-500"></div>
                        <span>Till Slutspel (1-2)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-1 h-3 bg-blue-500"></div>
                        <span>Ranking 3:or</span>
                    </div>
                </div>
            )}
        </div>
    )
}
