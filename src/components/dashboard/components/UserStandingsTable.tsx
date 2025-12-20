import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Trophy } from "lucide-react"
import { UserAvatar } from "@/components/UserAvatar"

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

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : !data || data.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        Ingen data tillgänglig än.
                    </div>
                ) : (
                    <div className="w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-16">#</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Spelare</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center hidden sm:table-cell">Rätt Tips</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center hidden sm:table-cell">Bonus</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Poäng</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {displayData?.map((row, index) => (
                                    <tr key={row.userId} className={`border-b transition-colors hover:bg-muted/50 ${index < 3 ? 'bg-muted/20' : ''}`}>
                                        <td className="p-4 align-middle">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${row.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                                row.rank === 2 ? 'bg-slate-100 text-slate-700' :
                                                    row.rank === 3 ? 'bg-orange-100 text-orange-800' :
                                                        'text-muted-foreground'
                                                }`}>
                                                {row.rank}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar
                                                    user={{
                                                        username: row.username,
                                                        avatarUrl: row.avatarUrl,
                                                        email: null
                                                    }}
                                                    className="h-10 w-10 border border-border/50 bg-background"
                                                />
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`font-medium ${row.rank === 1 ? 'text-yellow-700' : ''}`}>{row.username || 'Anonym'}</span>
                                                        {row.rank === 1 && <Trophy className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-center hidden sm:table-cell">{row.matchPoints}</td>
                                        <td className="p-4 align-middle text-center hidden sm:table-cell">{row.bonusPoints}</td>
                                        <td className="p-4 align-middle text-right font-bold text-lg text-emerald-600">{row.totalPoints}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
            {showFooter && data && data.length > (limit || 0) && (
                <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="text-sm text-muted-foreground">
                        Visar {displayData?.length} av {data.length} spelare
                    </div>
                    <Button variant="outline" size="sm" disabled>
                        Visa fler
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}
