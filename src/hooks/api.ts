import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CreateLeagueRequest, SubmitPredictionRequest, LeagueSettingsDto } from '@/lib/api'
import { supabase } from '@/lib/supabase'

// Cache duration constants (in milliseconds)
const STALE_TIME = {
    STATIC: 30 * 60 * 1000,    // 30 min - tournaments, teams (rarely change)
    SEMI_STATIC: 10 * 60 * 1000, // 10 min - user profile
    MODERATE: 5 * 60 * 1000,   // 5 min - leagues
    DYNAMIC: 2 * 60 * 1000,    // 2 min - matches, predictions, standings
}

// Helper to get token
export async function getToken() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) throw new Error('No access token')
    return session.access_token
}

// --- Tournaments ---
export function useTournaments(onlyActive = false) {
    return useQuery({
        queryKey: ['tournaments', { onlyActive }],
        queryFn: async () => {
            const token = await getToken()
            return api.tournaments.list(token, onlyActive)
        },
        staleTime: STALE_TIME.STATIC, // 30 min - tournaments rarely change
    })
}

export function useTournamentTeams(tournamentId: string) {
    return useQuery({
        queryKey: ['teams', tournamentId],
        queryFn: async () => {
            const token = await getToken()
            return api.tournaments.getTeams(token, tournamentId)
        },
        enabled: !!tournamentId,
        staleTime: STALE_TIME.STATIC, // 30 min - teams are static
    })
}

// --- Leagues ---
export function useLeagues() {
    return useQuery({
        queryKey: ['leagues'],
        queryFn: async () => {
            const token = await getToken()
            return api.leagues.list(token)
        },
        staleTime: STALE_TIME.MODERATE, // 5 min - user may join/leave
    })
}

export function useLeague(id: string) {
    return useQuery({
        queryKey: ['leagues', id],
        queryFn: async () => {
            const token = await getToken()
            return api.leagues.get(token, id)
        },
        enabled: !!id,
        staleTime: STALE_TIME.MODERATE, // 5 min
    })
}

export function useCreateLeague() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: CreateLeagueRequest) => {
            const token = await getToken()
            return api.leagues.create(token, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leagues'] })
        }
    })
}

export function useJoinLeague() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ leagueId, inviteCode }: { leagueId: string, inviteCode?: string }) => {
            const token = await getToken()
            return api.leagues.join(token, leagueId, inviteCode)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leagues'] })
        }
    })
}

export function useLeaveLeague() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (leagueId: string) => {
            const token = await getToken()
            return api.leagues.leave(token, leagueId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leagues'] })
        }
    })
}

export function useDeleteLeague() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (leagueId: string) => {
            const token = await getToken()
            return api.leagues.delete(token, leagueId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leagues'] })
        }
    })
}

export function useLeagueStandings(leagueId: string) {
    return useQuery({
        queryKey: ['leagues', leagueId, 'standings'],
        queryFn: async () => {
            const token = await getToken()
            return api.leagues.standings(token, leagueId)
        },
        enabled: !!leagueId,
        staleTime: STALE_TIME.DYNAMIC, // 2 min - updates after results
    })
}

// --- Matches ---
export function useMatches(tournamentId?: string, date?: string, teamId?: string) {
    return useQuery({
        queryKey: ['matches', { tournamentId, date, teamId }],
        queryFn: async () => {
            const token = await getToken()
            return api.matches.list(token, tournamentId, date, teamId)
        },
        enabled: !!tournamentId || !!date || !!teamId,
        staleTime: STALE_TIME.DYNAMIC, // 2 min - live scores update
    })
}

export function useMatch(id: string) {
    return useQuery({
        queryKey: ['matches', id],
        queryFn: async () => {
            const token = await getToken()
            return api.matches.get(token, id)
        },
        enabled: !!id,
        staleTime: STALE_TIME.DYNAMIC
    })
}

// --- Teams ---
export function useTeam(id: string) {
    return useQuery({
        queryKey: ['teams', id],
        queryFn: async () => {
            const token = await getToken()
            return api.teams.get(token, id)
        },
        enabled: !!id,
        staleTime: STALE_TIME.STATIC
    })
}

export function useTeamPlayers(id: string) {
    return useQuery({
        queryKey: ['teams', id, 'players'],
        queryFn: async () => {
            const token = await getToken()
            return api.players.getByTeam(token, id)
        },
        enabled: !!id,
        staleTime: STALE_TIME.STATIC
    })
}

export function useVenueByMatch(matchId: string) {
    return useQuery({
        queryKey: ['venues', 'match', matchId],
        queryFn: async () => {
            const token = await getToken()
            return api.venues.getByMatch(token, matchId)
        },
        enabled: !!matchId,
        staleTime: STALE_TIME.STATIC
    })
}

export function useTeamMatches(id: string) {
    return useQuery({
        queryKey: ['matches', { teamId: id }],
        queryFn: async () => {
            const token = await getToken()
            return api.matches.getByTeam(token, id)
        },
        enabled: !!id,
        staleTime: STALE_TIME.DYNAMIC
    })
}

// --- Settings Hooks ---
export function useUpdateLeagueSettings() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ leagueId, settings }: { leagueId: string, settings: Partial<LeagueSettingsDto> }) => {
            const token = await getToken()
            return api.leagues.updateSettings(token, leagueId, settings)
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['leagues', variables.leagueId] })
            queryClient.invalidateQueries({ queryKey: ['leagues'] })
        }
    })
}

// --- Predictions ---
export function usePredictions(leagueId?: string) {
    return useQuery({
        queryKey: ['predictions', { leagueId }],
        queryFn: async () => {
            const token = await getToken()
            return api.predictions.list(token, leagueId)
        },
        staleTime: STALE_TIME.DYNAMIC, // 2 min - user may edit
    })
}

export function useSubmitPrediction() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: SubmitPredictionRequest) => {
            const token = await getToken()
            return api.predictions.submit(token, data)
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['predictions', { leagueId: variables.leagueId }] })
        }
    })
}

export function useUpdatePrediction() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, homeScore, awayScore, leagueId: _leagueId }: { id: string; homeScore: number; awayScore: number; leagueId: string }) => {
            const token = await getToken()
            return api.predictions.update(token, id, { homeScore, awayScore })
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['predictions', { leagueId: variables.leagueId }] })
        }
    })
}

// --- Auth / User ---
export function useCurrentUser() {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const token = await getToken()
            return api.auth.me(token)
        },
        staleTime: STALE_TIME.SEMI_STATIC, // 10 min - profile rarely changes
    })
}

export function useUpdateProfile() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: import('@/lib/api').UpdateProfileRequest) => {
            const token = await getToken()
            return api.users.updateProfile(token, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        }
    })
}

