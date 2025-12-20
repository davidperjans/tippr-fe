import { useParams, useNavigate } from "react-router-dom"
import { useLeague, useLeagueStandings, useLeaveLeague, useDeleteLeague } from "@/hooks/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Users, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LeagueChatPanel } from "../components/LeagueChatPanel"
import { LeagueSettingsForm } from "../components/LeagueSettingsForm"
import { UserStandingsTable } from "../components/UserStandingsTable"

export function LeagueDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const { data: league, isLoading: leagueLoading } = useLeague(id!)
    const { data: standings, isLoading: standingsLoading } = useLeagueStandings(id!)
    const [copied, setCopied] = useState(false)

    if (leagueLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!league) {
        return <div className="text-center p-8">Ligan hittades inte</div>
    }

    const copyInviteCode = () => {
        if (league.inviteCode && league.id) {
            // Create a link that can be parsed by FindLeagueDialog
            // Format: https://domain.com/leagues/{id}?inviteCode={code}
            const link = `${window.location.origin}/leagues/${league.id}?inviteCode=${league.inviteCode}`
            navigator.clipboard.writeText(link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        {league.imageUrl ? (
                            <div className="w-12 h-12 shrink-0">
                                <img
                                    src={league.imageUrl}
                                    alt={league.name || 'League'}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                                {(league.name || 'L')[0]?.toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{league.name}</h1>
                            <div className="flex items-center text-muted-foreground text-sm">
                                <Users className="w-4 h-4 mr-1" />
                                <span>{league.memberCount || standings?.length || 0} deltagare</span>
                                <span className="mx-2">•</span>
                                <span>{league.isGlobal ? 'Global' : league.isPublic ? 'Publik' : 'Privat'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {!league.isPublic && (
                    <Button variant="outline" onClick={copyInviteCode} className="gap-2">
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Kopierat!' : 'Kopiera inbjudningskod'}
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={league.isGlobal ? "lg:col-span-3" : "lg:col-span-2"}>
                    <Tabs defaultValue="standings" className="w-full">
                        <TabsList>
                            <TabsTrigger value="standings">Tabell</TabsTrigger>
                            <TabsTrigger value="settings">Regler & Inställningar</TabsTrigger>
                        </TabsList>

                        <TabsContent value="standings" className="mt-6">
                            <UserStandingsTable
                                title="Tabell"
                                data={standings}
                                isLoading={standingsLoading}
                            />
                        </TabsContent>



                        <TabsContent value="settings" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Regler & Inställningar</CardTitle>
                                    <CardDescription>Poängsystem och regler för denna liga.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    {league.settings ? (
                                        <LeagueSettingsForm league={league} canEdit={!!(league.isOwner || league.isAdmin)} />
                                    ) : (
                                        <div className="text-center text-muted-foreground py-8">
                                            Inga inställningar hittades för denna liga.
                                        </div>
                                    )}

                                    <div className="pt-6 border-t">
                                        <h3 className="font-semibold text-lg mb-4">Lighantering</h3>
                                        <LeagueSettings league={league} memberCount={standings?.length || 0} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {!league.isGlobal && (
                    <div className="lg:col-span-1 space-y-6">
                        <LeagueChatPanel leagueId={league.id} />
                    </div>
                )}
            </div>
        </div>
    )
}

function LeagueSettings({ league, memberCount }: { league: any, memberCount: number }) {
    const leaveLeague = useLeaveLeague()
    const deleteLeague = useDeleteLeague()
    const navigate = useNavigate()

    // Permissions Logic
    // Delete: Only Owner
    // Edit: Owner or Admin (Admin check is done in parent TabsContent via canEdit prop)
    // Leave: Everyone except Owner

    const isOwner = !!league.isOwner
    // If not owner, check if user is admin via members list if possible, or trust league.isAdmin
    // Note: league.isAdmin might be boolean for "is current user admin"

    return (
        <div className="space-y-4">
            {isOwner ? (
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">Radera Liga</h3>
                    <p className="text-sm text-red-800 mb-4">
                        Radera hela ligan och alla dess poäng. Detta går inte att ångra.
                    </p>

                    <DeleteLeagueDialog
                        leagueName={league.name}
                        onConfirm={async () => {
                            await deleteLeague.mutateAsync(league.id)
                            toast.success("Ligan raderad")
                            navigate('/leagues')
                        }}
                        isDeleting={deleteLeague.isPending}
                        memberCount={memberCount}
                    />
                </div>
            ) : (
                <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Lämna Liga</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Du kan lämna ligan när som helst. Dina poäng kommer att tas bort från tabellen.
                    </p>

                    <LeaveLeagueDialog
                        onConfirm={async () => {
                            try {
                                await leaveLeague.mutateAsync(league.id)
                                toast.success("Du har lämnat ligan")
                                navigate('/leagues')
                            } catch (error: any) {
                                // Specific error handling for 404
                                if (error.message?.includes("404")) {
                                    toast.error("Kunde inte lämna ligan. API-fel (404).")
                                } else {
                                    toast.error("Kunde inte lämna ligan: " + (error.message || "Okänt fel"))
                                }
                            }
                        }}
                        isLeaving={leaveLeague.isPending}
                    />
                </div>
            )}
        </div>
    )
}

function LeaveLeagueDialog({ onConfirm, isLeaving }: {
    onConfirm: () => Promise<void>,
    isLeaving: boolean
}) {
    const [open, setOpen] = useState(false)

    const handleConfirm = async () => {
        await onConfirm()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">Lämna Liga</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Lämna Liga</DialogTitle>
                    <DialogDescription>
                        Är du säker på att du vill lämna ligan? Dina poäng kommer att nollställas om du går med igen senare.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLeaving}>Avbryt</Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isLeaving}
                    >
                        {isLeaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        Lämna
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DeleteLeagueDialog({ leagueName, onConfirm, isDeleting, memberCount }: {
    leagueName: string,
    onConfirm: () => Promise<void>,
    isDeleting: boolean,
    memberCount: number
}) {
    const [open, setOpen] = useState(false)
    const [confirmName, setConfirmName] = useState("")

    const handleConfirm = async () => {
        if (confirmName !== leagueName) return
        await onConfirm()
        setOpen(false)
    }

    // Only force name check if there are other members (memberCount > 1, assuming owner is 1)
    // Actually user said: "OM det är fler medlemmar med än bara admin" (so memberCount > 1).
    // If strict compliance: if memberCount <= 1, maybe just confirm?
    // User said: "vill att när admin ska klicka radera ska det först komma upp en varning sida OM det är fler medlemmar...". 
    // Implies if only 1 member (admin), standard confirm might suffice? 
    // But to be consistent and safe, let's use the dialog always but maybe simplify text if only 1 member? 
    // User request focused on the case with multiple members. 
    // Let's implement the dialog for all cases but emphasize the warning if members > 1.

    // Simplification: Always use the safe dialog as it is good practice, but I will make the warning text reflect the member count.

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">Radera Liga</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Är du absolut säker?</DialogTitle>
                    <DialogDescription className="space-y-3 pt-3">
                        {memberCount > 1 && (
                            <div className="p-3 bg-red-100/50 border border-red-200 rounded text-red-800 text-sm font-medium">
                                Det finns {memberCount} medlemmar i denna liga. Om du raderar den förlorar alla sina poäng.
                            </div>
                        )}
                        <p>
                            Skriv in ligans namn <span className="font-bold select-all text-foreground">{leagueName}</span> nedan för att bekräfta radering.
                        </p>
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <Label htmlFor="confirmName" className="sr-only">Ligans namn</Label>
                    <Input
                        id="confirmName"
                        value={confirmName}
                        onChange={(e) => setConfirmName(e.target.value)}
                        placeholder={leagueName}
                        className="font-mono"
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>Avbryt</Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={confirmName !== leagueName || isDeleting}
                    >
                        {isDeleting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        Radera ligan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
