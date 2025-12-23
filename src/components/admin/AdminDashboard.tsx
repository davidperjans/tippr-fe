import { Card } from '@/components/ui/card'
import {
    Users,
    Trophy,
    Calendar,
    TrendingUp,
    Activity,
    Shield,
    Loader2
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api, MatchStatus } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useMemo } from 'react'

const quickActions = [
    { label: 'Hantera användare', description: 'Se och redigera användarroller', icon: Users, to: '/admin/users' },
    { label: 'Uppdatera matcher', description: 'Ändra matchresultat manuellt', icon: Calendar, to: '/admin/matches' },
    { label: 'Turneringar', description: 'Aktivera och hantera turneringar', icon: Trophy, to: '/admin/tournaments' },
]

export function AdminDashboard() {
    const { token } = useAuth()

    // Fetch data for stats
    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ['admin', 'users', '', 1, 1],
        queryFn: () => api.admin.users.list(token!, { pageSize: 1 }),
        enabled: !!token,
    })

    const { data: leaguesData, isLoading: leaguesLoading } = useQuery({
        queryKey: ['admin', 'leagues', '', 1, 1],
        queryFn: () => api.admin.leagues.list(token!, { pageSize: 1 }),
        enabled: !!token,
    })

    const { data: matches, isLoading: matchesLoading } = useQuery({
        queryKey: ['matches'],
        queryFn: () => api.matches.list(token!),
        enabled: !!token,
    })

    // Calculate stats
    const upcomingMatches = useMemo(() => {
        if (!matches) return 0
        return matches.filter(m => m.status === MatchStatus.Scheduled).length
    }, [matches])

    const finishedMatches = useMemo(() => {
        if (!matches) return 0
        return matches.filter(m => m.status === MatchStatus.Finished).length
    }, [matches])

    const stats = [
        {
            label: 'Totalt användare',
            value: usersLoading ? '—' : usersData?.totalCount?.toString() || '0',
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
            to: '/admin/users'
        },
        {
            label: 'Aktiva ligor',
            value: leaguesLoading ? '—' : leaguesData?.totalCount?.toString() || '0',
            icon: Trophy,
            color: 'from-amber-500 to-orange-500',
            to: null
        },
        {
            label: 'Kommande matcher',
            value: matchesLoading ? '—' : upcomingMatches.toString(),
            icon: Calendar,
            color: 'from-emerald-500 to-teal-500',
            to: '/admin/matches'
        },
        {
            label: 'Avslutade matcher',
            value: matchesLoading ? '—' : finishedMatches.toString(),
            icon: TrendingUp,
            color: 'from-purple-500 to-pink-500',
            to: '/admin/matches'
        },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
                    <p className="text-text-secondary">Välkommen! Här kan du hantera Tippr.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    const content = (
                        <Card
                            key={stat.label}
                            className="p-4 bg-bg-surface border-border-subtle hover:border-border-default transition-all group"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col gap-3"
                            >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-text-primary">
                                        {stat.value === '—' ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-text-tertiary" />
                                        ) : (
                                            stat.value
                                        )}
                                    </p>
                                    <p className="text-xs text-text-tertiary">{stat.label}</p>
                                </div>
                            </motion.div>
                        </Card>
                    )
                    return stat.to ? <Link key={stat.label} to={stat.to}>{content}</Link> : <div key={stat.label}>{content}</div>
                })}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-500" />
                    Snabbåtgärder
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon
                        return (
                            <Link key={action.label} to={action.to}>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                    <Card className="p-5 bg-bg-surface border-border-subtle hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all cursor-pointer group">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                                                <Icon className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-text-primary group-hover:text-amber-600 transition-colors">
                                                    {action.label}
                                                </h3>
                                                <p className="text-sm text-text-tertiary mt-0.5">
                                                    {action.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* System Status */}
            <Card className="p-5 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        Systemet fungerar normalt
                    </span>
                </div>
            </Card>
        </motion.div>
    )
}
