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
import { Search } from "lucide-react"

export function FindLeagueDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
           <Search className="w-4 h-4" /> Hitta Liga
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gå med i en liga</DialogTitle>
          <DialogDescription>
            Ange inbjudningskod eller sök efter publika ligor.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-2">
            <Label htmlFor="code">Inbjudningskod</Label>
            <Input id="code" placeholder="T.ex. WINNER24" className="uppercase" />
          </div>
          <div className="relative">
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-muted-foreground text-xs uppercase">Eller</span>
             </div>
             <div className="border-t border-border" />
          </div>
          <div className="grid items-center gap-2">
             <Label htmlFor="search">Sök Liga</Label>
             <Input id="search" placeholder="Liga namn..." />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Sök & Gå med</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
