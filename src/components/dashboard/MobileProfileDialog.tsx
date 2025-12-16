import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, LogOut } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

export function MobileProfileDialog() {
  const { user, signOut } = useAuth()
  
  if (!user) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors text-muted-foreground hover:text-foreground">
           <User className="w-5 h-5 stroke-2" />
           <span className="text-[10px] font-medium">Profil</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[90%] rounded-xl">
        <DialogHeader>
          <DialogTitle>Min Profil</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-6 gap-4">
             <Avatar className="w-20 h-20">
                <AvatarFallback className="text-2xl bg-gradient-to-tr from-emerald-400 to-cyan-400 text-white font-bold">
                    {(user.user_metadata?.full_name?.[0] || user.email?.[0] || '').toUpperCase()}
                </AvatarFallback>
             </Avatar>
             <div className="text-center">
                 <h3 className="font-bold text-lg">{user.user_metadata?.full_name || 'Användare'}</h3>
                 <p className="text-muted-foreground text-sm">{user.email}</p>
             </div>
        </div>
        <DialogFooter className="flex-col gap-2">
          <Button variant="destructive" className="w-full gap-2" onClick={() => signOut()}>
            <LogOut className="w-4 h-4" /> Logga ut
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
