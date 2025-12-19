import { useTournaments } from "@/hooks/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Trophy } from "lucide-react"
import { Link } from "react-router-dom"
import { Loader2 } from "lucide-react"

export function Tournaments() {
    const { data: tournaments, isLoading, error } = useTournaments()

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-destructive">
                <p>Kunde inte ladda turneringar</p>
                <Button variant="outline" onClick={() => window.location.reload()}>Försök igen</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Turneringar</h1>
                    <p className="text-muted-foreground">Välj en turnering att tippa i.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tournaments?.map((tournament) => (
                    <Link key={tournament.id} to={`/tournaments/${tournament.id}`}>
                        <Card className="group relative overflow-hidden transition-all hover:shadow-lg h-full border-muted/40 hover:border-primary/50">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />

                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="line-clamp-1">{tournament.name}</CardTitle>
                                        <CardDescription>
                                            {new Date(tournament.startDate).getFullYear()}
                                        </CardDescription>
                                    </div>
                                    <div className="rounded-full bg-primary/10 p-2 text-primary shrink-0 relative overflow-hidden w-10 h-10 flex items-center justify-center">
                                        {tournament.logoUrl ? (
                                            <img src={tournament.logoUrl} alt={tournament.name || ''} className="w-full h-full object-cover" />
                                        ) : (
                                            <Trophy className="h-5 w-5" />
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="grid gap-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {new Date(tournament.startDate).toLocaleDateString('sv-SE')} - {new Date(tournament.endDate).toLocaleDateString('sv-SE')}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {tournaments?.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        Inga turneringar hittades.
                    </div>
                )}
            </div>
        </div>
    )
}
