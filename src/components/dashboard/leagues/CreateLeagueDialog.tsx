import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { useTournaments, useCreateLeague } from "@/hooks/api"
import { toast } from "react-hot-toast"

interface CreateLeagueDialogProps {
  trigger?: React.ReactNode;
}

export function CreateLeagueDialog({ trigger }: CreateLeagueDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [tournamentId, setTournamentId] = useState("")
  const [isPrivate, setIsPrivate] = useState(true)

  const { data: tournaments, isLoading: tournamentsLoading } = useTournaments(true)
  const createLeague = useCreateLeague()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      toast.error("Vänligen ange ett namn på ligan")
      return
    }

    // Default to first tournament if not selected
    const selectedTournamentId = tournamentId || (tournaments && tournaments.length > 0 ? tournaments[0].id : "")

    if (!selectedTournamentId) {
      toast.error("Ingen turnering vald")
      return
    }

    try {
      await createLeague.mutateAsync({
        name,
        tournamentId: selectedTournamentId,
        isPublic: !isPrivate,
        description: description || null,
        maxMembers: null,
        imageUrl: null
      })
      toast.success("Liga skapad!")
      setOpen(false)
      setName("")
      setDescription("")
      setIsPrivate(true)
    } catch (error: any) {
      console.error("Create league error", error)
      toast.error("Kunde inte skapa liga: " + error.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : (
          <Button className="gap-2 flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4" /> Skapa Liga
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Skapa ny Liga</DialogTitle>
            <DialogDescription>
              Bjud in vänner och tävla om vem som är bäst på att tippa.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-2">
              <Label htmlFor="name">Liga Namn</Label>
              <Input
                id="name"
                placeholder="T.ex. Kompisgänget"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={createLeague.isPending}
              />
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="description">Beskrivning</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Vad handlar ligan om?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={createLeague.isPending}
              />
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="sport">Välj Turnering</Label>
              {tournamentsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Laddar turneringar...
                </div>
              ) : (
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={tournamentId}
                  onChange={(e) => setTournamentId(e.target.value)}
                  disabled={createLeague.isPending}
                >
                  {tournaments?.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex items-center space-x-2 pt-2 gap-2">
              <input
                type="checkbox"
                id="private"
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                disabled={createLeague.isPending}
              />
              <Label htmlFor="private" className="cursor-pointer">Privat liga (kräver inbjudan)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
              disabled={createLeague.isPending}
            >
              {createLeague.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Skapa Liga
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
