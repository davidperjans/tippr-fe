import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function MockLeaderboard() {
  const users = [
    { rank: 1, name: "Anna S.", points: 142, trend: 'up', avatar: 'bg-emerald-500' },
    { rank: 2, name: "Johan K.", points: 138, trend: 'same', avatar: 'bg-blue-500' },
    { rank: 3, name: "Maria L.", points: 135, trend: 'up', avatar: 'bg-purple-500' },
    { rank: 4, name: "Erik B.", points: 129, trend: 'down', avatar: 'bg-orange-500' },
    { rank: 5, name: "Kalle P.", points: 124, trend: 'down', avatar: 'bg-pink-500' },
  ]

  return (
    <div className="bg-card border rounded-3xl shadow-2xl overflow-hidden max-w-md w-full mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-500 relative z-10">
      {/* Header */}
      <div className="bg-primary/10 p-6 border-b flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl text-white">
                <Trophy className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-lg leading-tight">VM 2026 - Kompisligan</h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Topplistan just nu</p>
            </div>
         </div>
         <div className="text-xs font-bold px-2 py-1 bg-background border rounded text-muted-foreground">
            Live
         </div>
      </div>

      {/* List */}
      <div className="divide-y divide-border/50">
         {users.map((user) => (
            <div key={user.rank} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors cursor-default group">
                <div className="font-bold text-muted-foreground w-6 text-center">{user.rank}</div>
                
                <div className={`w-10 h-10 rounded-full ${user.avatar} text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-background border-2 border-transparent group-hover:border-primary/20 transition-all`}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">8 rätt senaste omgången</p>
                </div>

                <div className="text-right">
                    <div className="font-bold text-lg">{user.points}p</div>
                    {user.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500 ml-auto" />}
                    {user.trend === 'down' && <TrendingDown className="w-3 h-3 text-rose-500 ml-auto" />}
                    {user.trend === 'same' && <Minus className="w-3 h-3 text-muted-foreground ml-auto" />}
                </div>
            </div>
         ))}
      </div>
      
      {/* Footer */}
      <div className="p-4 bg-muted/30 text-center text-xs text-muted-foreground border-t">
         Uppdaterades för 2 minuter sedan
      </div>
    </div>
  )
}
