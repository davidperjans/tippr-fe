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
import { Plus } from "lucide-react"

export function CreateLeagueDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700">
           <Plus className="w-4 h-4" /> Skapa Liga
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Skapa ny Liga</DialogTitle>
          <DialogDescription>
            Bjud in vänner och tävla om vem som är bäst på att tippa.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-2">
            <Label htmlFor="name">Liga Namn</Label>
            <Input id="name" placeholder="T.ex. Kompisgänget VT25" />
          </div>
          <div className="grid items-center gap-2">
            <Label htmlFor="sport">Liga/Turnering</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option>Premier League 24/25</option>
                <option>Allsvenskan 2025</option>
                <option>Champions League</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 pt-2">
             <input type="checkbox" id="private" className="rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
             <Label htmlFor="private" className="cursor-pointer">Privat liga (kräver kod)</Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Skapa Liga</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
