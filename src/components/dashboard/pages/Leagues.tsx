import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { Link } from 'react-router-dom'
import { FindLeagueDialog } from "../leagues/FindLeagueDialog"
import { CreateLeagueDialog } from "../leagues/CreateLeagueDialog"


export function Leagues() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mina Ligor</h2>
          <p className="text-muted-foreground">Hantera dina ligor eller gå med i nya.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
             <FindLeagueDialog />
             <CreateLeagueDialog />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
            { name: "Kompisligan", members: 12, role: "Admin", active: true },
            { name: "Global Open", members: 5432, role: "Spelare", active: true },
            { name: "Jobbet VT25", members: 24, role: "Spelare", active: true },
            { name: "Sommarcupen 24", members: 8, role: "Admin", active: false },
        ].map((league, i) => (
            <Card key={i} className={league.active ? '' : 'opacity-60 grayscale'}>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                            {league.name[0]}
                        </div>
                        {league.role === 'Admin' && (
                            <span className="text-[10px] uppercase font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Admin</span>
                        )}
                    </div>
                    <CardTitle className="mt-4">{league.name}</CardTitle>
                    <CardDescription>{league.active ? 'Pågående säsong' : 'Avslutad'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Users className="w-4 h-4 mr-2" />
                        {league.members} deltagare
                    </div>
                    <Button variant={league.active ? "default" : "secondary"} className="w-full" asChild>
                        {league.active ? (
                            <Link to={`/leagues/${i + 1}`}>Gå till ligan</Link>
                        ) : (
                            <span>Se resultat</span>
                        )}
                    </Button>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
