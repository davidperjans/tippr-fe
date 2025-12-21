import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CreateLeagueRequest, SubmitPredictionRequest, LeagueSettingsDto } from '@/lib/api'
import { supabase } from '@/lib/supabase'

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
        }
    })
}

export function useTournamentTeams(tournamentId: string) {
    return useQuery({
        queryKey: ['teams', tournamentId],
        queryFn: async () => {
            const token = await getToken()
            return api.tournaments.getTeams(token, tournamentId)
        },
        enabled: !!tournamentId
    })
}

// --- Leagues ---
export function useLeagues() {
    return useQuery({
        queryKey: ['leagues'],
        queryFn: async () => {
            const token = await getToken()
            return api.leagues.list(token)
        }
    })
}

export function useLeague(id: string) {
    return useQuery({
        queryKey: ['leagues', id],
        queryFn: async () => {
            const token = await getToken()
            return api.leagues.get(token, id)
        },
        enabled: !!id
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
        enabled: !!leagueId
    })
}

// --- Matches ---
export function useMatches(tournamentId?: string, date?: string) {
    return useQuery({
        queryKey: ['matches', { tournamentId, date }],
        queryFn: async () => {
            const token = await getToken()
            return api.matches.list(token, tournamentId, date)
        },
        // Only run if we have at least one filter, OR if we want to allow fetching all
        enabled: !!tournamentId || !!date
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
        }
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
        }
    })
}
