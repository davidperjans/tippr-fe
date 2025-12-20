import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2, Trophy } from "lucide-react"
import { UserAvatar } from "@/components/UserAvatar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export interface StandingsRow {
    userId: string
    username: string | null
    avatarUrl: string | null
    matchPoints: number
    bonusPoints: number
    totalPoints: number
    rank: number
}

interface UserStandingsTableProps {
    title: string
    data: StandingsRow[] | undefined
    isLoading: boolean
    limit?: number
    showFooter?: boolean
}

export function UserStandingsTable({ title, data, isLoading, limit, showFooter = false }: UserStandingsTableProps) {
    const displayData = limit && data ? data.slice(0, limit) : data

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center border border-border-subtle rounded-xl bg-bg-surface shadow-sm">
                <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center border border-dashed border-border-subtle rounded-xl bg-bg-subtle/30 text-text-tertiary">
                <Trophy className="h-10 w-10 opacity-20 mb-3" />
                <p>Ingen data tillgänglig än.</p>
            </div>
        )
    }

    return (
        <Card className="overflow-hidden border-border-subtle shadow-sm">
            <CardHeader className="border-b border-border-subtle/50 bg-bg-subtle/10 py-4">
                <CardTitle className="text-lg text-text-primary flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-brand-500" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-bg-subtle/40">
                        <TableRow className="hover:bg-transparent border-border-subtle">
                            <TableHead className="w-16 text-center text-text-tertiary font-bold tracking-wider uppercase text-[10px]">Rank</TableHead>
                            <TableHead className="text-text-tertiary font-bold tracking-wider uppercase text-[10px]">Spelare</TableHead>
                            <TableHead className="text-center text-text-tertiary font-bold tracking-wider uppercase text-[10px] hidden sm:table-cell">Rätt Tips</TableHead>
                            <TableHead className="text-center text-text-tertiary font-bold tracking-wider uppercase text-[10px] hidden sm:table-cell">Bonus</TableHead>
                            <TableHead className="text-right text-text-primary font-bold tracking-wider uppercase text-[10px]">Poäng</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayData?.map((row) => (
                            <TableRow key={row.userId} className="group border-border-subtle hover:bg-bg-subtle/40 bg-bg-surface transition-colors">
                                <TableCell className="text-center py-3">
                                    <div className={`w-6 h-6 mx-auto rounded-md flex items-center justify-center font-bold text-xs ${row.rank === 1 ? 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200' :
                                            row.rank === 2 ? 'bg-slate-100 text-slate-700 ring-1 ring-slate-200' :
                                                row.rank === 3 ? 'bg-orange-100 text-orange-800 ring-1 ring-orange-200' :
                                                    'text-text-tertiary'
                                        }`}>
                                        {row.rank}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-3">
                                        <UserAvatar
                                            user={{
                                                username: row.username,
                                                avatarUrl: row.avatarUrl,
                                                email: null
                                            }}
                                            className="h-9 w-9 border border-border-subtle shadow-sm"
                                        />
                                        <div className="flex flex-col">
                                            <span className={`font-semibold text-sm ${row.rank <= 3 ? 'text-text-primary' : 'text-text-secondary'} group-hover:text-text-primary transition-colors`}>{row.username || 'Anonym'}</span>
                                            {row.rank === 1 && <span className="text-[10px] text-yellow-600 font-medium">Ledarinnan/Ledaren</span>}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center tabular-nums text-text-secondary hidden sm:table-cell">{row.matchPoints}</TableCell>
                                <TableCell className="text-center tabular-nums text-text-secondary hidden sm:table-cell">{row.bonusPoints}</TableCell>
                                <TableCell className="text-right tabular-nums font-bold text-brand-600 text-base">{row.totalPoints}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {showFooter && data.length > (limit || 0) && (
                    <div className="p-4 border-t border-border-subtle bg-bg-subtle/20 flex justify-center">
                        <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary" disabled>
                            Visa fler
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
