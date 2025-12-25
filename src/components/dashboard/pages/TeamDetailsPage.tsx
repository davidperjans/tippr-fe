import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom"
import { useTeam, useTeamPlayers, useTeamMatches } from "@/hooks/api"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Calendar, MapPin, Info } from "lucide-react"
import { TeamBadge } from "@/components/team/TeamBadge"
import { SquadWidget } from "@/components/team/SquadWidget"
import { FixturesWidget } from "@/components/team/FixturesWidget"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs-simple"
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { getToken } from '@/hooks/api'

// Helper for venue since we don't have a direct hook for team venue yet in main hooks file easily accessible?
// We can just add a small ad-hoc query here or rely on the venues.getByTeam if we exported the hook.
// Let's assume we want to fetch venue for this team.
function useTeamVenue(teamId: string) {
    return useQuery({
        queryKey: ['venues', 'team', teamId],
        queryFn: async () => {
            const token = await getToken()
            return api.venues.getByTeam(token, teamId)
        },
        enabled: !!teamId,
        staleTime: 1000 * 60 * 60 // 1 hour
    })
}

export function TeamDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("fixtures")

    const { data: team, isLoading: teamLoading } = useTeam(id || '')
    const { data: players, isLoading: playersLoading } = useTeamPlayers(id || '')
    const { data: matches, isLoading: matchesLoading } = useTeamMatches(id || '')
    const { data: venue, isLoading: venueLoading } = useTeamVenue(id || '')

    const isLoading = teamLoading

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            </div>
        )
    }

    if (!team) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-text-secondary">Laget kunde inte hittas</p>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Tillbaka
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Tillbaka
            </Button>

            {/* Hero Section */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-8 flex flex-col items-center text-center relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-50 to-transparent opacity-50 pointer-events-none"></div>

                <TeamBadge team={team} size="xl" showName={false} className="relative z-10 scale-125 mb-4" />

                <h1 className="text-3xl font-bold text-text-primary relative z-10">
                    {team.displayName ?? team.name}
                </h1>

                <div className="flex items-center gap-3 mt-4 text-sm text-text-secondary relative z-10">
                    {team.code && (
                        <span className="font-mono bg-bg-subtle px-2 py-1 rounded border border-border-subtle">
                            {team.code}
                        </span>
                    )}
                    {team.fifaRank && (
                        <span className="bg-brand-100 text-brand-700 px-2 py-1 rounded font-medium flex items-center gap-1">
                            🏆 #{team.fifaRank}
                        </span>
                    )}
                    {team.groupName && (
                        <span className="bg-bg-subtle px-2 py-1 rounded border border-border-subtle">
                            Grupp {team.groupName}
                        </span>
                    )}
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex justify-center">
                <div className="inline-flex h-10 items-center justify-center rounded-lg bg-bg-surface p-1 text-text-secondary border border-border-subtle shadow-sm">
                    <button
                        onClick={() => setActiveTab("fixtures")}
                        className={cn(
                            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                            activeTab === "fixtures" ? "bg-brand-600 text-white shadow-sm" : "hover:bg-bg-subtle hover:text-text-primary"
                        )}
                    >
                        <Calendar className="w-4 h-4 mr-2" />
                        Matcher
                    </button>
                    <button
                        onClick={() => setActiveTab("squad")}
                        className={cn(
                            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                            activeTab === "squad" ? "bg-brand-600 text-white shadow-sm" : "hover:bg-bg-subtle hover:text-text-primary"
                        )}
                    >
                        <Users className="w-4 h-4 mr-2" />
                        Trupp
                    </button>
                    <button
                        onClick={() => setActiveTab("venue")}
                        className={cn(
                            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                            activeTab === "venue" ? "bg-brand-600 text-white shadow-sm" : "hover:bg-bg-subtle hover:text-text-primary"
                        )}
                    >
                        <MapPin className="w-4 h-4 mr-2" />
                        Arena
                    </button>
                </div>
            </div>


            {/* Content Content - Custom Tabs Implementation since we need flexible state */}
            <div className="space-y-6">

                {activeTab === "fixtures" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-brand-600" />
                                    Spelschema & Resultat
                                </h2>
                                {matchesLoading ? (
                                    <div className="py-8 flex justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" /></div>
                                ) : matches ? (
                                    <FixturesWidget matches={matches} teamId={team.id} />
                                ) : (
                                    <div className="text-center py-8 text-text-tertiary">Inga matcher tillgängliga.</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === "squad" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-brand-600" />
                                    Trupp
                                </h2>
                                {playersLoading ? (
                                    <div className="py-8 flex justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" /></div>
                                ) : players ? (
                                    <SquadWidget players={players} />
                                ) : (
                                    <div className="text-center py-8 text-text-tertiary">Truppinformation kommer snart.</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === "venue" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Card>
                            <CardContent className="p-0 overflow-hidden">
                                {venueLoading ? (
                                    <div className="p-12 flex justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" /></div>
                                ) : venue ? (
                                    <div>
                                        {venue.imageUrl ? (
                                            <div className="relative h-64 w-full">
                                                <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                <div className="absolute bottom-0 left-0 p-6 text-white">
                                                    <h3 className="text-2xl font-bold">{venue.name}</h3>
                                                    {venue.city && <p className="text-white/80 flex items-center gap-2 mt-1"><MapPin className="w-4 h-4" /> {venue.city}</p>}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-bg-subtle h-48 flex items-center justify-center flex-col gap-3 text-text-tertiary">
                                                <MapPin className="w-12 h-12 opacity-20" />
                                                <h3 className="text-xl font-bold text-text-secondary">{venue.name}</h3>
                                            </div>
                                        )}

                                        <div className="p-6 grid grid-cols-2 gap-6">
                                            <div className="bg-bg-subtle/50 p-4 rounded-xl border border-border-subtle">
                                                <div className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Kapacitet</div>
                                                <div className="text-2xl font-mono text-text-primary mt-1">
                                                    {venue.capacity ? venue.capacity.toLocaleString() : 'N/A'}
                                                </div>
                                            </div>
                                            <div className="bg-bg-subtle/50 p-4 rounded-xl border border-border-subtle">
                                                <div className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Underlag</div>
                                                <div className="text-lg text-text-primary mt-1">
                                                    {venue.surface || 'Okänt'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-text-tertiary flex flex-col items-center gap-4">
                                        <Info className="w-8 h-8 opacity-20" />
                                        <p>Ingen arenainformation tillgänglig för detta lag.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
