import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table"
import { cn } from "../../lib/utils"

export interface TeamStats {
    id: string;
    name: string;
    logoUrl?: string | null;
    mp: number;
    w: number;
    d: number;
    l: number;
    gf: number;
    ga: number;
    pts: number;
    rank?: number;
}

interface StandingsTableProps {
    teams: TeamStats[];
    compact?: boolean;
    showQualification?: boolean;
}

export function StandingsTable({ teams, compact = false, showQualification = false }: StandingsTableProps) {
    return (
        <div className="rounded-xl border border-border-subtle bg-bg-surface overflow-hidden shadow-sm">
            <Table className={cn("w-full", compact ? "text-xs" : "text-sm")}>
                <TableHeader className="bg-bg-subtle/50">
                    <TableRow className="border-border-subtle hover:bg-transparent">
                        <TableHead className="w-12 text-center text-text-tertiary font-medium">#</TableHead>
                        <TableHead className="text-text-tertiary font-medium">Lag</TableHead>
                        <TableHead className="w-10 text-center text-text-tertiary font-medium" title="Matcher Spelade">M</TableHead>
                        <TableHead className="w-8 text-center text-text-tertiary font-medium hidden sm:table-cell" title="Vinster">V</TableHead>
                        <TableHead className="w-8 text-center text-text-tertiary font-medium hidden sm:table-cell" title="Oavgjorda">O</TableHead>
                        <TableHead className="w-8 text-center text-text-tertiary font-medium hidden sm:table-cell" title="Förluster">F</TableHead>
                        <TableHead className="w-12 text-center text-text-tertiary font-medium hidden lg:table-cell" title="Målskillnad">+/-</TableHead>
                        <TableHead className="w-14 text-center font-bold text-text-primary">P</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teams.map((team, index) => {
                        const rank = index + 1

                        // Qualification Logic
                        let indicator = ""

                        if (showQualification) {
                            if (index === 0 || index === 1) {
                                indicator = "border-l-4 border-l-success"
                            } else if (index === 2) {
                                indicator = "border-l-4 border-l-info"
                            } else {
                                indicator = "border-l-4 border-l-transparent"
                            }
                        }

                        return (
                            <TableRow
                                key={team.id}
                                className={cn(
                                    "group border-border-subtle hover:bg-bg-subtle/30 transition-colors relative",
                                    indicator,
                                    showQualification && index === 1 && "!border-t-border-subtle", // Standard border
                                    showQualification && index === 2 && "!border-t-success/50", // Greenish separator
                                    showQualification && index === 3 && teams.length > 3 && "!border-t-info/50" // Blueish separator
                                )}
                            >
                                <TableCell className="text-center font-mono font-medium text-text-tertiary group-hover:text-text-secondary h-10 py-2">
                                    {rank}
                                </TableCell>
                                <TableCell className="font-medium text-text-primary py-2">
                                    <div className="flex items-center gap-3">
                                        {team.logoUrl ? (
                                            <img src={team.logoUrl} alt={team.name} className="w-5 h-5 object-contain" />
                                        ) : (
                                            <div className="w-5 h-5 rounded bg-brand-50 flex items-center justify-center text-[9px] font-bold text-brand-600">
                                                {team.name.substring(0, 1)}
                                            </div>
                                        )}
                                        <span className="truncate max-w-[120px] sm:max-w-none">{team.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center text-text-secondary tabular-nums py-2">{team.mp}</TableCell>
                                <TableCell className="text-center text-text-secondary tabular-nums hidden sm:table-cell py-2">{team.w}</TableCell>
                                <TableCell className="text-center text-text-secondary tabular-nums hidden sm:table-cell py-2">{team.d}</TableCell>
                                <TableCell className="text-center text-text-secondary tabular-nums hidden sm:table-cell py-2">{team.l}</TableCell>
                                <TableCell className="text-center text-text-tertiary tabular-nums hidden lg:table-cell py-2">
                                    <span className={cn(
                                        "font-medium",
                                        (team.gf - team.ga) > 0 ? "text-success" : (team.gf - team.ga) < 0 ? "text-danger" : "text-text-tertiary"
                                    )}>
                                        {(team.gf - team.ga) > 0 ? '+' : ''}{team.gf - team.ga}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center font-bold text-text-primary tabular-nums text-base py-2">
                                    {team.pts}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            {showQualification && !compact && (
                <div className="px-4 py-3 bg-bg-subtle/20 flex gap-6 text-[10px] uppercase font-medium tracking-wider text-text-tertiary border-t border-border-subtle">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-3 bg-success rounded-full"></div>
                        <span>Till Slutspel (1-2)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-3 bg-info rounded-full"></div>
                        <span>Ranking 3:or</span>
                    </div>
                </div>
            )}
        </div>
    )
}
