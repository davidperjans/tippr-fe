import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Standings() {
  const standing = [
    { rank: 1, user: "KalleKula", points: 154, correct: 12, trend: "up" },
    { rank: 2, user: "LisaL", points: 148, correct: 10, trend: "same" },
    { rank: 3, user: "FotbollsDanne", points: 142, correct: 11, trend: "down" },
    { rank: 4, user: "Erik", points: 139, correct: 9, trend: "up" },
    { rank: 5, user: "AnnaB", points: 135, correct: 10, trend: "same" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tabeller</h2>
        <p className="text-muted-foreground">Global ranking för aktuell säsong.</p>
      </div>

      <Card>
        <CardHeader>
           <CardTitle>Top 100</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <div className="w-full overflow-auto">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-16">#</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Spelare</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">Rätt Tips</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Poäng</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {standing.map((row) => (
                            <tr key={row.rank} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle font-bold">{row.rank}</td>
                                <td className="p-4 align-middle">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary">
                                            {row.user[0]}
                                        </div>
                                        <span className="font-medium">{row.user}</span>
                                    </div>
                                </td>
                                <td className="p-4 align-middle text-center">{row.correct}</td>
                                <td className="p-4 align-middle text-right font-bold text-emerald-600">{row.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
