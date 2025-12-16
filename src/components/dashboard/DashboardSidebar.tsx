import { Home, Trophy, Target, BarChart2, LogOut, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { NavLink } from 'react-router-dom'

export function DashboardSidebar() {
  const { user, signOut } = useAuth()

  const menuItems = [
    { path: '/overview', label: 'Översikt', icon: Home },
    { path: '/leagues', label: 'Mina Ligor', icon: Trophy },
    { path: '/betting', label: 'Tippa', icon: Target },
    { path: '/standings', label: 'Tabell', icon: BarChart2 },
  ]

  return (
    <div className="hidden md:flex w-20 lg:w-72 shrink-0 flex-col bg-card border-r border-border h-screen sticky top-0 transition-all duration-300">
      {/* Logo Area */}
      <div className="flex items-center justify-center lg:justify-start gap-3 px-6 py-8 border-b border-border/50">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
          <Trophy className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="hidden lg:block text-xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
          Tippr
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={item.label}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-primary/10 text-primary font-bold shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            {({ isActive }) => (
                <>
                    <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'stroke-[2.5px]' : 'stroke-2 group-hover:text-foreground'}`} />
                    <span className="hidden lg:block font-medium">{item.label}</span>
                </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 mt-auto border-t border-border/50">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shadow-inner shrink-0">
             {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || '').toUpperCase() || <User className="w-4 h-4" />}
          </div>
          <div className="hidden lg:block overflow-hidden min-w-0">
            <p className="text-sm font-semibold truncate text-foreground">{user?.user_metadata?.full_name || 'Användare'}</p>
            <p className="text-xs text-muted-foreground truncate opacity-70 cursor-pointer hover:opacity-100 transition-opacity" onClick={signOut}>Logga ut</p>
          </div>
          <button onClick={() => signOut()} className="ml-auto p-1.5 text-muted-foreground hover:text-destructive transition-colors hidden lg:block" title="Logga ut">
              <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
