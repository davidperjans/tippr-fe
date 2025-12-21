import { useTournaments } from "@/hooks/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Trophy, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

function TournamentsSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-border-subtle p-6 flex items-center gap-6">
                        <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-3">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="w-10 h-10 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function Tournaments() {
    const { data: tournaments, isLoading, error } = useTournaments()

    if (isLoading) return <TournamentsSkeleton />

    if (error) {
        return (
            <motion.div
                className="flex h-[50vh] flex-col items-center justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-danger" />
                </div>
                <p className="text-text-secondary font-medium">Kunde inte ladda turneringar</p>
                <Button variant="outline" onClick={() => window.location.reload()}>Försök igen</Button>
            </motion.div>
        )
    }

    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-text-primary">Turneringar</h1>
                <p className="text-text-secondary">Välj en turnering att tippa i.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {tournaments?.map((tournament, i) => (
                    <motion.div
                        key={tournament.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Link to={`/tournaments/${tournament.id}`} className="group block">
                            <Card className="flex flex-row items-center p-6 gap-6 hover:shadow-lg hover:border-brand-300 transition-all duration-300 relative overflow-hidden bg-bg-surface">
                                {/* Decorative Badge Background */}
                                <div className="absolute right-0 top-0 w-32 h-32 bg-brand-50/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />

                                <div className="relative w-20 h-20 shrink-0 bg-white rounded-xl shadow-sm border border-border-subtle p-2 flex items-center justify-center">
                                    {tournament.logoUrl ? (
                                        <img src={tournament.logoUrl} alt={tournament.name || ''} className="w-full h-full object-contain" />
                                    ) : (
                                        <Trophy className="h-8 w-8 text-brand-500" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 relative">
                                    <h3 className="text-xl font-bold text-text-primary group-hover:text-brand-600 transition-colors truncate">
                                        {tournament.name}
                                    </h3>

                                    <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4 text-text-tertiary" />
                                            <span>{new Date(tournament.startDate).getFullYear()}</span>
                                        </div>
                                        <div className="h-1 w-1 rounded-full bg-text-tertiary" />
                                        <span className="text-text-tertiary">VM</span>
                                    </div>
                                </div>

                                <div className="relative self-center">
                                    <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 text-text-tertiary group-hover:text-brand-600 group-hover:bg-brand-50">
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                ))}

                {tournaments?.length === 0 && (
                    <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-border-subtle bg-bg-subtle/30">
                        <Trophy className="h-8 w-8 mx-auto text-text-tertiary mb-3 opacity-50" />
                        <p className="text-text-secondary">Inga turneringar hittades.</p>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
