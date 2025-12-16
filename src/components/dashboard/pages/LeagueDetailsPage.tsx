import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Settings, MessageSquare, Copy, Send, ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export function LeagueDetailsPage() {
  const { id } = useParams()
  // Mock data based on ID - in reality fetch from API
  const leagueName = "Kompisligan"

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <Link to="/leagues" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Tillbaka
        </Link>
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {leagueName[0]}
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{leagueName}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Users className="w-4 h-4" /> 12 Deltagare • ID: {id}
                    </div>
                </div>
            </div>
            <Button variant="outline" className="gap-2 hidden sm:flex" onClick={() => navigator.clipboard.writeText("XYZ-123")}>
                <Copy className="w-4 h-4" /> Bjud in (Kod: XYZ-123)
            </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="scoreboard" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px] mb-4">
          <TabsTrigger value="scoreboard">Poängställning</TabsTrigger>
          <TabsTrigger value="chat">Chatt</TabsTrigger>
          <TabsTrigger value="settings">Inställningar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scoreboard" className="flex-1 min-h-0">
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Tabell</CardTitle>
                    <CardDescription>Aktuell ställning i {leagueName}.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <div className="overflow-auto h-[500px]"> {/* Fixed height or flex-1 if parent supports it */}
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 sticky top-0 z-10">
                                <tr className="border-b">
                                    <th className="h-10 px-4 text-left font-medium w-16">#</th>
                                    <th className="h-10 px-4 text-left font-medium">Spelare</th>
                                    <th className="h-10 px-4 text-center font-medium">Rätt</th>
                                    <th className="h-10 px-4 text-right font-medium">Poäng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { rank: 1, name: "David P", points: 154, correct: 18, me: true },
                                    { rank: 2, name: "Kalle", points: 148, correct: 16, me: false },
                                    { rank: 3, name: "Lisa", points: 142, correct: 16, me: false },
                                    { rank: 4, name: "Erik", points: 130, correct: 14, me: false },
                                    { rank: 5, name: "Anna", points: 125, correct: 12, me: false },
                                    // ... more mock data
                                ].map((row) => (
                                    <tr key={row.rank} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${row.me ? 'bg-primary/5' : ''}`}>
                                        <td className="p-4 font-bold text-muted-foreground">{row.rank}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarFallback className={row.me ? "bg-primary text-primary-foreground" : ""}>
                                                        {row.name[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className={`font-medium ${row.me ? 'text-primary' : ''}`}>{row.name} {row.me && '(Du)'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-muted-foreground">{row.correct}</td>
                                        <td className="p-4 text-right font-bold text-lg">{row.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="chat" className="flex-1 min-h-0">
            <Card className="h-[600px] flex flex-col">
                 <CardHeader className="py-4 border-b">
                     <div className="flex items-center gap-2">
                         <MessageSquare className="w-4 h-4" />
                         <span className="font-bold">Liga-chatt</span>
                     </div>
                 </CardHeader>
                 <CardContent className="flex-1 p-0 flex flex-col min-h-0">
                     <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {[
                                { user: "Kalle", time: "10:42", text: "Trodde verkligen Arsenal skulle ta det...", self: false },
                                { user: "Lisa", time: "10:45", text: "Haha skyll dig själv som tippar med hjärtat!", self: false },
                                { user: "Du", time: "10:48", text: "Jag klättrar sakta men säkert! 😎", self: true },
                            ].map((msg, i) => (
                                <div key={i} className={`flex gap-3 ${msg.self ? 'justify-end' : ''}`}>
                                    {!msg.self && <Avatar className="w-8 h-8 mt-1"><AvatarFallback>K</AvatarFallback></Avatar>}
                                    <div className={`rounded-xl p-3 max-w-[80%] text-sm ${msg.self ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <div className="flex justify-between gap-4 mb-1 opacity-70 text-xs">
                                            <span className="font-bold">{msg.user}</span>
                                            <span>{msg.time}</span>
                                        </div>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                     </ScrollArea>
                     <div className="p-4 border-t flex gap-2">
                         <Input placeholder="Skriv ett meddelande..." className="flex-1" />
                         <Button size="icon"><Send className="w-4 h-4" /></Button>
                     </div>
                 </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="settings">
             <Card>
                 <CardHeader>
                     <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Inställningar</CardTitle>
                     <CardDescription>Endast admins kan ändra dessa inställningar.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                     <div className="grid gap-2">
                         <label className="text-sm font-medium">Liga Namn</label>
                         <Input defaultValue={leagueName} />
                     </div>
                     <div className="grid gap-2">
                         <label className="text-sm font-medium">Inbjudningskod</label>
                         <div className="flex gap-2">
                             <Input defaultValue="XYZ-123" readOnly />
                             <Button variant="outline" size="icon"><Copy className="w-4 h-4" /></Button>
                         </div>
                     </div>
                     <div className="pt-4 border-t">
                         <Button variant="destructive">Radera Liga</Button>
                     </div>
                 </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
