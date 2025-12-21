import { useState, useEffect, createContext, useContext } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    actualTheme: 'light' | 'dark'
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('theme') as Theme) || 'system'
        }
        return 'system'
    })
    const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        const root = window.document.documentElement

        const applyTheme = () => {
            let resolvedTheme: 'light' | 'dark'

            if (theme === 'system') {
                resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            } else {
                resolvedTheme = theme
            }

            root.classList.remove('light', 'dark')
            root.classList.add(resolvedTheme)
            setActualTheme(resolvedTheme)
        }

        applyTheme()
        localStorage.setItem('theme', theme)

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme()
            }
        }
        mediaQuery.addEventListener('change', handleChange)

        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function ThemeToggle({ className }: { className?: string }) {
    const { actualTheme, setTheme } = useTheme()

    return (
        <button
            onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
            className={cn(
                "relative inline-flex h-9 w-9 items-center justify-center rounded-lg",
                "bg-bg-subtle hover:bg-bg-muted",
                "text-text-secondary hover:text-text-primary",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                className
            )}
            aria-label="Toggle theme"
        >
            <Sun className={cn(
                "h-4 w-4 transition-all duration-300",
                actualTheme === 'dark' ? "rotate-0 scale-100" : "rotate-90 scale-0 absolute"
            )} />
            <Moon className={cn(
                "h-4 w-4 transition-all duration-300",
                actualTheme === 'light' ? "rotate-0 scale-100" : "-rotate-90 scale-0 absolute"
            )} />
        </button>
    )
}
