import { useEffect, useRef } from 'react'
import { useTheme } from '@/components/theme/ThemeProvider'
import '@/styles/api-sports-theme.css'

interface ApiSportsWidgetProps {
    apiKey: string
    type: 'game' | 'h2h' | 'standings' | 'team' | 'player'
    // Game widget
    gameId?: number
    gameTab?: 'events' | 'statistics' | 'lineups' | 'players'
    // H2H widget
    teamIds?: [number, number] // [homeTeamId, awayTeamId]
    // Common
    refresh?: number | boolean
    showErrors?: boolean
    className?: string
}

export function ApiSportsWidget({
    apiKey,
    type,
    gameId,
    gameTab,
    teamIds,
    refresh = false,
    showErrors = false,
    className
}: ApiSportsWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const { theme } = useTheme()
    const widgetTheme = theme === 'dark' ? 'tippr-dark' : 'tippr'

    useEffect(() => {
        if (!containerRef.current) return

        // Clear previous content
        containerRef.current.innerHTML = ''

        // Create config widget
        const configWidget = document.createElement('api-sports-widget')
        configWidget.setAttribute('data-type', 'config')
        configWidget.setAttribute('data-key', apiKey)
        configWidget.setAttribute('data-sport', 'football')
        configWidget.setAttribute('data-lang', 'sv')
        configWidget.setAttribute('data-theme', widgetTheme)
        if (showErrors) {
            configWidget.setAttribute('data-show-errors', 'true')
        }
        containerRef.current.appendChild(configWidget)

        // Create main widget
        const mainWidget = document.createElement('api-sports-widget')
        mainWidget.setAttribute('data-type', type)
        mainWidget.setAttribute('data-theme', widgetTheme)

        if (type === 'game' && gameId) {
            mainWidget.setAttribute('data-game-id', gameId.toString())
            if (gameTab) {
                mainWidget.setAttribute('data-game-tab', gameTab)
            }
            if (typeof refresh === 'number') {
                mainWidget.setAttribute('data-refresh', refresh.toString())
            } else if (refresh) {
                mainWidget.setAttribute('data-refresh', 'true')
            }
        }

        if (type === 'h2h' && teamIds) {
            mainWidget.setAttribute('data-h2h', `${teamIds[0]}-${teamIds[1]}`)
        }

        containerRef.current.appendChild(mainWidget)

        // Cleanup
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = ''
            }
        }
    }, [apiKey, type, gameId, gameTab, teamIds, refresh, showErrors, widgetTheme])

    return <div ref={containerRef} className={className} />
}

// Hook to get API key from environment
export function useApiSportsKey() {
    // Use environment variable or placeholder
    return import.meta.env.VITE_API_SPORTS_KEY || ''
}
