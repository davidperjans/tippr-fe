import { Home, Trophy, Target, BarChart2, LogOut, Globe, Info } from 'lucide-react'
import { UserAvatar } from '../UserAvatar'
import { useAuth } from '../../contexts/AuthContext'
import { NavLink } from 'react-router-dom'

export function DashboardSidebar() {
  const { user, backendUser, signOut } = useAuth()

  const displayName = backendUser?.displayName || user?.user_metadata?.displayName || user?.email || 'Användare';

  const menuItems = [
    { path: '/overview', label: 'Översikt', icon: Home },
    { path: '/tournaments', label: 'Turneringar', icon: Globe },
    { path: '/leagues', label: 'Mina Ligor', icon: Trophy },
    { path: '/betting', label: 'Tippa', icon: Target },
    { path: '/standings', label: 'Tabell', icon: BarChart2 },
    { path: '/information', label: 'Information', icon: Info },
  ]

  return (
    <div className="hidden md:flex w-20 lg:w-72 shrink-0 flex-col bg-card border-r border-border h-screen sticky top-0 transition-all duration-300">
      {/* Logo Area */}
      <div className="flex items-center justify-center lg:justify-start gap-3 px-6 py-8 border-b border-border/50">
        <img src="/logo.svg" alt="Tippr" className="w-8 h-8" />
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
        <NavLink
          to="/profile"
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-3 rounded-2xl border transition-all cursor-pointer group
            ${isActive ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-muted/30 border-border/50 hover:bg-muted/50 hover:border-border'}
          `}
        >
          <UserAvatar
            user={{
              username: displayName,
              avatarUrl: backendUser?.avatarUrl,
              email: user?.email
            }}
            className="w-9 h-9 shadow-inner shrink-0 group-hover:scale-105 transition-transform overflow-hidden relative"
            fallbackClassName="text-white bg-gradient-to-tr from-emerald-400 to-cyan-400"
          />
          <div className="hidden lg:block overflow-hidden min-w-0 flex-1 text-left">
            <p className="text-sm font-semibold truncate text-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate opacity-70 group-hover:opacity-100 transition-opacity">Visa profil</p>
          </div>
          <div
            role="button"
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation to profile
              signOut();
            }}
            className="ml-auto p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors hidden lg:block"
            title="Logga ut"
          >
            <LogOut className="w-4 h-4" />
          </div>
        </NavLink>
      </div>
    </div>
  )
}
