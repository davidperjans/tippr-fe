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
import { Search, Loader2 } from "lucide-react"
import { useJoinLeague } from "@/hooks/api"
import { toast } from "react-hot-toast"

interface FindLeagueDialogProps {
  trigger?: React.ReactNode;
}

export function FindLeagueDialog({ trigger }: FindLeagueDialogProps) {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState("")
  const joinLeague = useJoinLeague()

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) return

    let leagueId = code.trim()
    let inviteCode: string | undefined = undefined

    // Try to parse as URL
    try {
      if (code.includes('http') || code.includes('tippr')) {
        const url = new URL(code)
        // Pattern: /leagues/:id/join
        const match = url.pathname.match(/leagues\/([a-f0-9-]+)/i)
        if (match && match[1]) {
          leagueId = match[1]
        }
        // Parse query param 'code' or 'inviteCode'
        inviteCode = url.searchParams.get('code') || url.searchParams.get('inviteCode') || undefined
      }
      // If not URL, assume input is just the ID (if UUID)
      // If the user pastes "CODE", we still fail because we need ID. 
      // But let's support ID at least.
    } catch (err) {
      // Not a valid URL, treat as raw string
    }

    // Basic validation: League ID should at least look like a UUID or long string
    if (leagueId.length < 10) {
      toast.error("Ogiltigt Liga ID. Vänligen klistra in en fullständig länk eller ett giltigt ID.")
      return
    }

    try {
      await joinLeague.mutateAsync({ leagueId, inviteCode })
      toast.success("Du har gått med i ligan!")
      setOpen(false)
      setCode("")
    } catch (error: any) {
      // Extract 404 specifically
      if (error.message?.includes('404')) {
        toast.error("Ligan hittades inte. Kontrollera IDet.")
      } else {
        toast.error("Kunde inte gå med: " + (error.message || "Okänt fel"))
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : (
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
            <Search className="w-4 h-4" /> Gå med
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleJoin}>
          <DialogHeader>
            <DialogTitle>Gå med i en liga</DialogTitle>
            <DialogDescription>
              Klistra in en inbjudningslänk eller Liga ID.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-2">
              <Label htmlFor="code">Länk eller ID</Label>
              <Input
                id="code"
                placeholder="https://tippr.se/leagues/..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={joinLeague.isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!code || joinLeague.isPending}>
              {joinLeague.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Gå med
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
