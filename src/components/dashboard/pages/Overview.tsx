import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, TrendingUp, Users, ArrowRight, Target, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MatchStatus } from "@/lib/api"
import { Link } from 'react-router-dom'
import { useLeagues, useMatches, useTournaments } from "@/hooks/api"
import { MatchRow } from "@/components/matches/MatchRow"
import { Skeleton, SkeletonCard, SkeletonMatchRow, SkeletonLeagueItem } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Skeleton */}
      <Skeleton className="h-48 rounded-3xl" />

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <Skeleton className="h-6 w-40" />
          <div className="rounded-2xl border border-border-subtle overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonMatchRow key={i} />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <Skeleton className="h-6 w-32" />
          <div className="rounded-2xl border border-border-subtle p-4 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLeagueItem key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Overview() {
  const { data: leagues, isLoading: leaguesLoading, error: leaguesError } = useLeagues()
  const { data: tournaments, isLoading: tournamentsLoading } = useTournaments(true)
  const activeTournamentId = tournaments?.[0]?.id
  const { data: matches, isLoading: matchesLoading } = useMatches(activeTournamentId)

  const isLoading = leaguesLoading || tournamentsLoading || matchesLoading

  const upcomingMatches = (matches || [])
    .filter(m => m.status === MatchStatus.Scheduled)
    .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())
    .slice(0, 5)

  if (isLoading) return <OverviewSkeleton />

  if (leaguesError) {
    return (
      <motion.div
        className="p-6 text-danger bg-danger/10 rounded-2xl border border-danger/20 flex items-center gap-3"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-10 h-10 rounded-xl bg-danger/20 flex items-center justify-center">
          <span className="text-danger text-lg">!</span>
        </div>
        <div>
          <p className="font-semibold">Kunde inte ladda data</p>
          <p className="text-sm text-danger/80">Försök igen om en stund.</p>
        </div>
      </motion.div>
    )
  }

  const activeLeaguesCount = leagues?.length || 0
  const upcomingMatchesCount = upcomingMatches.length || 0

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Hero Header */}
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-8 md:p-10 text-white shadow-xl shadow-brand-500/25"
        variants={itemVariants}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-400/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-brand-200" />
              <span className="text-sm font-medium text-brand-200">Välkommen tillbaka</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Översikt</h1>
            <p className="text-brand-100 mt-2 max-w-md">
              Håll koll på dina ligor, kommande matcher och din ranking i realtid.
            </p>
          </div>
          <Link
            to="/betting"
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-brand-600 rounded-xl font-semibold text-sm hover:bg-brand-50 transition-all shadow-lg shadow-black/10 hover:shadow-xl shrink-0 group"
          >
            <Target className="w-5 h-5" />
            Tippa Nu
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" variants={itemVariants}>
        {[
          { label: 'Total Poäng', value: '0', icon: Trophy, gradient: 'from-amber-500 to-orange-500' },
          { label: 'Global Rank', value: '-', sub: 'Topp 10%', icon: TrendingUp, gradient: 'from-brand-500 to-brand-600' },
          { label: 'Ligor', value: activeLeaguesCount, sub: 'Aktiva', icon: Users, gradient: 'from-blue-500 to-indigo-500' },
          { label: 'Att Tippa', value: upcomingMatchesCount, sub: 'Matcher', icon: Target, gradient: 'from-purple-500 to-pink-500' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card variant="interactive" className="group h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">{stat.label}</span>
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-text-primary tabular-nums group-hover:text-brand-600 transition-colors">{stat.value}</span>
                  {stat.sub && <span className="text-sm text-text-secondary">{stat.sub}</span>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Matches */}
        <motion.div className="lg:col-span-2 space-y-5" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">Kommande Matcher</h2>
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-brand-600 hover:text-brand-700">
              <Link to="/betting" className="gap-1">
                Se spelschema
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <Card variant="default" className="overflow-hidden">
            {upcomingMatches.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-bg-subtle flex items-center justify-center">
                  <Target className="w-8 h-8 text-text-tertiary" />
                </div>
                <p className="text-text-secondary font-medium">Inga kommande matcher</p>
                <p className="text-sm text-text-tertiary mt-1">Kom tillbaka snart!</p>
              </div>
            ) : (
              <div className="divide-y divide-border-subtle">
                {upcomingMatches.map((match, i) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <MatchRow
                      match={match}
                      onBetClick={() => { }}
                      variant="default"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </Card>

          <Button variant="outline" className="w-full sm:hidden" asChild>
            <Link to="/betting">Visa alla matcher</Link>
          </Button>
        </motion.div>

        {/* Right Column: Leagues */}
        <motion.div className="space-y-5" variants={itemVariants}>
          <h2 className="text-xl font-bold text-text-primary">Dina Ligor</h2>

          <Card variant="default">
            <CardHeader className="pb-3 border-b border-border-subtle/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-md shadow-brand-500/20">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-base">Mina Ligor</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-1">
                {(leagues || []).length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-sm text-text-tertiary">Du är inte med i några ligor än.</p>
                    <Button variant="default" size="sm" asChild className="mt-3">
                      <Link to="/leagues">Utforska ligor</Link>
                    </Button>
                  </div>
                ) : (
                  (leagues || []).map((league, i) => (
                    <motion.div
                      key={league.id || i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={`/leagues/${league.id}`}
                        className="flex items-center justify-between p-3 -mx-2 rounded-xl hover:bg-bg-subtle transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 font-bold text-sm uppercase shadow-sm">
                            {(league.name || '?')[0]}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-text-primary truncate group-hover:text-brand-600 transition-colors">{league.name}</span>
                            <span className="text-xs text-text-tertiary">{league.isPublic ? 'Publik liga' : 'Privat liga'}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
              {(leagues || []).length > 0 && (
                <div className="mt-4 pt-4 border-t border-border-subtle">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/leagues">Hitta fler ligor</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
