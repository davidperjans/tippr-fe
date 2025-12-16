import { NavLink } from 'react-router-dom'
import { Home, Trophy, Target, BarChart2 } from 'lucide-react'

import { MobileProfileDialog } from './MobileProfileDialog'

export function DashboardMobileNav() {
  const menuItems = [
    { path: '/overview', label: 'Översikt', icon: Home },
    { path: '/leagues', label: 'Ligor', icon: Trophy },
    { path: '/betting', label: 'Tippa', icon: Target },
    { path: '/standings', label: 'Tabell', icon: BarChart2 },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-50 pb-6">
      <nav className="grid grid-cols-5 h-16 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
               flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors
               ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
            `}
          >
            {({ isActive }) => (
               <>
                 <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                 <span className="text-[10px] font-medium">{item.label}</span>
               </>
            )}
          </NavLink>
        ))}
        <MobileProfileDialog />
      </nav>
    </div>
  )
}
