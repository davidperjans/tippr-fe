import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Betting() {
  const matches = [
    {
      league: "Premier League",
      home: "Arsenal",
      away: "Liverpool",
      date: "Idag, 18:30",
      logoHome: "https://media.api-sports.io/football/teams/42.png",
      logoAway: "https://media.api-sports.io/football/teams/40.png"
    },
    {
      league: "Serie A",
      home: "Juventus",
      away: "AC Milan",
      date: "Imorgon, 20:45",
      logoHome: "https://media.api-sports.io/football/teams/496.png",
      logoAway: "https://media.api-sports.io/football/teams/489.png"
    },
    {
      league: "La Liga",
      home: "Real Madrid",
      away: "Valencia",
      date: "Lördag, 21:00",
      logoHome: "https://media.api-sports.io/football/teams/541.png",
      logoAway: "https://media.api-sports.io/football/teams/532.png"
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tippa Matcher</h2>
        <p className="text-muted-foreground">Lägg dina tips för kommande omgångar.</p>
      </div>

      <div className="space-y-4">
        {matches.map((match, i) => (
            <Card key={i} className="overflow-hidden">
                <div className="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground flex justify-between items-center">
                    <span>{match.league}</span>
                    <span>{match.date}</span>
                </div>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Teams */}
                        <div className="flex items-center justify-between w-full md:w-2/5 gap-4">
                            <div className="flex flex-col items-center gap-2 flex-1 text-center">
                                <img src={match.logoHome} alt="Home" className="w-12 h-12 object-contain" />
                                <span className="font-bold text-sm md:text-base">{match.home}</span>
                            </div>
                            <span className="text-muted-foreground font-bold text-lg">VS</span>
                            <div className="flex flex-col items-center gap-2 flex-1 text-center">
                                <img src={match.logoAway} alt="Away" className="w-12 h-12 object-contain" />
                                <span className="font-bold text-sm md:text-base">{match.away}</span>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-xl border border-border/50">
                             <input type="number" className="w-12 h-10 text-center rounded-md border border-input bg-background font-bold" placeholder="-" />
                             <span className="font-bold text-muted-foreground">-</span>
                             <input type="number" className="w-12 h-10 text-center rounded-md border border-input bg-background font-bold" placeholder="-" />
                        </div>
                        
                        <Button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700">Tippa</Button>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
