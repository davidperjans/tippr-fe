import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Loader2, ArrowRight, Trophy, Search, Crown } from "lucide-react"
import { Link } from 'react-router-dom'
import { FindLeagueDialog } from "../leagues/FindLeagueDialog"
import { CreateLeagueDialog } from "../leagues/CreateLeagueDialog"
import { useLeagues } from "@/hooks/api"
import { useAuth } from "@/contexts/AuthContext"

export function Leagues() {
  const { data: leagues, isLoading } = useLeagues()
  const { backendUser } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Empty State: Two Distinct Options
  if (!leagues || leagues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Välkommen till Ligor</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Du är inte med i några ligor än. Välj ett alternativ nedan för att komma igång.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl px-4">
          {/* Create League Option */}
          <CreateLeagueDialog trigger={
            <div className="group relative flex flex-col items-center justify-center p-8 h-64 border-2 border-dashed rounded-xl hover:border-emerald-500 hover:bg-emerald-50/10 transition-all cursor-pointer bg-card text-card-foreground shadow-sm hover:shadow-md">
              <div className="p-4 rounded-full bg-emerald-100/20 text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Skapa en liga</h3>
              <p className="text-muted-foreground text-center text-sm px-4">
                Starta en egen liga, bjud in dina vänner och tävla om äran.
              </p>
              <Button variant="ghost" className="mt-6 group-hover:text-emerald-600">
                Starta nu <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          } />

          {/* Join League Option */}
          <FindLeagueDialog trigger={
            <div className="group relative flex flex-col items-center justify-center p-8 h-64 border-2 border-dashed rounded-xl hover:border-blue-500 hover:bg-blue-50/10 transition-all cursor-pointer bg-card text-card-foreground shadow-sm hover:shadow-md">
              <div className="p-4 rounded-full bg-blue-100/20 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Gå med i en liga</h3>
              <p className="text-muted-foreground text-center text-sm px-4">
                Har du en inbjudningskod? Gå med i en befintlig liga här.
              </p>
              <Button variant="ghost" className="mt-6 group-hover:text-blue-600">
                Gå med nu <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          } />
        </div>
      </div>
    )
  }

  // Standard View (Leagues Exist)
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mina Ligor</h2>
          <p className="text-muted-foreground">Hantera dina ligor.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <FindLeagueDialog />
          <CreateLeagueDialog />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {leagues.map((league) => {
          const isOwner = backendUser?.userId && league.ownerId
            ? backendUser.userId.toLowerCase() === league.ownerId.toLowerCase()
            : false;

          return (
            <Card key={league.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {(league.name || 'L')[0]?.toUpperCase()}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-1">
                      {isOwner && (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-full border border-purple-200">
                          <Crown className="w-3 h-3" /> Ägare
                        </span>
                      )}
                      {league.isPublic ? (
                        <span className="text-[10px] uppercase font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">Publik</span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full border border-amber-200">Privat</span>
                      )}
                    </div>
                  </div>
                </div>
                <CardTitle className="mt-4 truncate">{league.name}</CardTitle>
                <CardDescription className="line-clamp-1">{league.description || 'Ingen beskrivning'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Users className="w-4 h-4 mr-2" />
                  {league.memberCount || 0} deltagare
                </div>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link to={`/leagues/${league.id}`}>
                    Gå till ligan <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
