import { useParams, useNavigate } from "react-router-dom"
import { useLeague, useLeagueStandings, useLeaveLeague, useDeleteLeague } from "@/hooks/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Users, Copy, Check, Shield, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LeagueChatPanel } from "../components/LeagueChatPanel"
import { LeagueSettingsForm } from "../components/LeagueSettingsForm"
import { UserStandingsTable } from "../components/UserStandingsTable"
import { Badge } from "@/components/ui/badge"

export function LeagueDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const { data: league, isLoading: leagueLoading } = useLeague(id!)
    const { data: standings, isLoading: standingsLoading } = useLeagueStandings(id!)
    const [copied, setCopied] = useState(false)

    if (leagueLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            </div>
        )
    }

    if (!league) {
        return <div className="text-center p-8 text-text-primary">Ligan hittades inte</div>
    }

    const copyInviteCode = () => {
        if (league.inviteCode && league.id) {
            const link = `${window.location.origin}/leagues/${league.id}?inviteCode=${league.inviteCode}`
            navigator.clipboard.writeText(link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

            {/* Header Section */}
            <div className="relative rounded-2xl bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-900 p-8 shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex items-start gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-inner">
                            {league.imageUrl ? (
                                <img
                                    src={league.imageUrl}
                                    alt={league.name || 'League'}
                                    className="w-full h-full object-contain p-2"
                                />
                            ) : (
                                <span className="text-3xl font-bold text-white">{(league.name || 'L')[0]?.toUpperCase()}</span>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                {league.isGlobal && <Badge className="bg-amber-400/20 text-amber-200 border-amber-400/30 hover:bg-amber-400/30">Global</Badge>}
                                {league.isOwner && <Badge className="bg-emerald-400/20 text-emerald-200 border-emerald-400/30 hover:bg-emerald-400/30">Ägare</Badge>}
                                {!league.isPublic && <Badge variant="outline" className="border-white/20 text-white/70">Privat</Badge>}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">{league.name}</h1>
                            <div className="flex items-center text-white/60 text-sm gap-4">
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4" />
                                    <span>{league.memberCount || standings?.length || 0} deltagare</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Trophy className="w-4 h-4" />
                                    <span>{league.settings?.predictionMode === 'AllAtOnce' ? 'Hela turneringen' : 'Per match'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!league.isPublic && (
                        <Button
                            variant="secondary"
                            onClick={copyInviteCode}
                            className="bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-sm"
                        >
                            {copied ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? 'Kopierat!' : 'Bjud in vänner'}
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Standings & Settings) */}
                <div className={league.isGlobal ? "lg:col-span-3" : "lg:col-span-2"}>
                    <Tabs defaultValue="standings" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-bg-subtle/50 rounded-lg">
                            <TabsTrigger value="standings" className="rounded-md">Tabell</TabsTrigger>
                            <TabsTrigger value="settings" className="rounded-md">Regler & Inställningar</TabsTrigger>
                        </TabsList>

                        <TabsContent value="standings" className="space-y-6">
                            <UserStandingsTable
                                title="Tabell"
                                data={standings}
                                isLoading={standingsLoading}
                            />
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card className="border-border-subtle shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <CardTitle>Regler & Inställningar</CardTitle>
                                            <CardDescription>Hantera ligans inställningar och medlemskap.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    {league.settings ? (
                                        <LeagueSettingsForm league={league} canEdit={!!(league.isOwner || league.isAdmin)} />
                                    ) : (
                                        <div className="text-center text-text-tertiary py-8 border-2 border-dashed border-border-subtle rounded-xl">
                                            Inga specifika inställningar för denna liga.
                                        </div>
                                    )}

                                    <div className="pt-8 border-t border-border-subtle">
                                        <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                                            <span className="w-1 h-5 bg-danger rounded-full" />
                                            Riskzonen
                                        </h3>
                                        <LeagueSettings league={league} memberCount={standings?.length || 0} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar (Chat) */}
                {!league.isGlobal && (
                    <div className="lg:col-span-1">
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

    const isOwner = !!league.isOwner

    return (
        <div className="grid gap-4">
            {isOwner ? (
                <div className="p-4 border border-danger/20 bg-danger/5 rounded-xl">
                    <h4 className="font-semibold text-danger mb-1">Radera Liga</h4>
                    <p className="text-sm text-text-secondary mb-4">
                        Ta bort ligan permanent. Alla poäng och historik försvinner för alla medlemmar.
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
                <div className="p-4 border border-border-subtle bg-bg-surface rounded-xl">
                    <h4 className="font-semibold text-text-primary mb-1">Lämna Liga</h4>
                    <p className="text-sm text-text-secondary mb-4">
                        Du tas bort från tabellen. Om du går med igen nollställs dina poäng.
                    </p>

                    <LeaveLeagueDialog
                        onConfirm={async () => {
                            try {
                                await leaveLeague.mutateAsync(league.id)
                                toast.success("Du har lämnat ligan")
                                navigate('/leagues')
                            } catch (error: any) {
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
                <Button variant="outline" className="text-danger hover:text-danger hover:bg-danger/10 border-danger/20">Lämna Liga</Button>
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
                            <div className="p-3 bg-danger/10 border border-danger/20 rounded text-danger text-sm font-medium">
                                Varning: Det finns {memberCount} medlemmar i denna liga. Om du raderar den förlorar alla sina poäng.
                            </div>
                        )}
                        <p>
                            Skriv in ligans namn <span className="font-bold select-all text-text-primary">{leagueName}</span> nedan för att bekräfta radering.
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
                        className="font-mono bg-bg-subtle"
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
