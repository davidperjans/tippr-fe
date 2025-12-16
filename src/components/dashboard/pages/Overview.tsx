import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, TrendingUp, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Overview() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Poäng</CardTitle>
            <Trophy className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+24 från förra veckan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rankning</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#42</div>
            <p className="text-xs text-muted-foreground">Topp 5% av spelarna</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva Ligor</CardTitle>
            <Users className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Du leder 1 liga</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kommande Tips</CardTitle>
            <ArrowRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Matcher denna vecka</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Sections */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Senaste Resultat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { match: "Man United vs Liverpool", user: "2-1", result: "2-2", points: 1 },
                { match: "Arsenal vs Chelsea", user: "3-0", result: "3-1", points: 3 },
                { match: "Real Madrid vs Barcelona", user: "1-1", result: "1-1", points: 5 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{item.match}</span>
                    <span className="text-xs text-muted-foreground">Ditt tips: {item.user} • Resultat: {item.result}</span>
                  </div>
                  <div className={`font-bold ${item.points === 5 ? 'text-emerald-500' : 'text-primary'}`}>
                    +{item.points}p
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Dina Ligor</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {[
                    { name: "Kompisligan", rank: 1, total: 12 },
                    { name: "Jobbet VT25", rank: 5, total: 24 },
                    { name: "Global Open", rank: 142, total: 5000 },
                ].map((league, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                {league.name[0]}
                            </div>
                            <div>
                                <p className="font-medium text-sm">{league.name}</p>
                                <p className="text-xs text-muted-foreground">{league.total} spelare</p>
                            </div>
                        </div>
                        <div className="text-sm font-bold">#{league.rank}</div>
                    </div>
                ))}
                <Button variant="outline" className="w-full mt-2" size="sm">Visa alla ligor</Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
