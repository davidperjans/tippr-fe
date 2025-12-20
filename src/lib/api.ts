const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7126'

// --- Types based on Swagger ---

export interface CurrentUserResponse {
    userId: string;
    email: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    lastLoginAt: string;
}

export interface LeagueDto {
    id: string;
    name: string | null;
    description: string | null;
    tournamentId: string;
    ownerId: string;
    inviteCode: string | null;
    isPublic: boolean;
    isGlobal: boolean;
    maxMembers: number | null;
    imageUrl: string | null;
    memberCount?: number;
    isOwner?: boolean;
    isAdmin?: boolean;
    settings?: LeagueSettingsDto;
}

export interface LeagueSettingsDto {
    id: string;
    leagueId: string;
    predictionMode: PredictionMode;
    deadlineMinutes: number;
    pointsCorrectScore: number;
    pointsCorrectOutcome: number;
    pointsCorrectGoals: number;
    pointsRoundOf16Team: number;
    pointsQuarterFinalTeam: number;
    pointsSemiFinalTeam: number;
    pointsFinalTeam: number;
    pointsTopScorer: number;
    pointsWinner: number;
    pointsMostGoalsGroup: number;
    pointsMostConcededGroup: number;
    allowLateEdits: boolean;
}

export type PredictionMode = 'AllAtOnce' | 'PerMatch';

export interface CreateLeagueRequest {
    name: string;
    description: string | null;
    tournamentId: string;
    isPublic: boolean;
    maxMembers?: number | null;
    imageUrl?: string | null;
}

export interface MatchDto {
    id: string;
    tournamentId: string;
    homeTeamId: string;
    homeTeamName: string | null;
    homeTeamLogoUrl: string | null;
    awayTeamId: string;
    awayTeamName: string | null;
    awayTeamLogoUrl: string | null;
    matchDate: string;
    stage: MatchStage;
    status: MatchStatus;
    homeScore: number | null;
    awayScore: number | null;
    venue: string | null;
    groupName: string | null;
    updatedAt: string | null;
}

export interface TeamDto {
    id: string;
    name: string | null;
    code: string | null;
    flagUrl: string | null;
    groupName: string | null;
    fifaRank: number | null;
}

export const MatchStage = {
    Group: 0,
    RoundOf16: 1,
    QuarterFinal: 2,
    SemiFinal: 3,
    Final: 4
} as const;

export type MatchStage = typeof MatchStage[keyof typeof MatchStage];

export const MatchStatus = {
    Scheduled: 0,
    InProgress: 1,
    Finished: 2,
    Postponed: 3,
    Cancelled: 4
} as const;

export type MatchStatus = typeof MatchStatus[keyof typeof MatchStatus];

export interface PredictionDto {
    id: string;
    userId: string;
    leagueId: string;
    matchId: string;
    homeScore: number;
    awayScore: number;
    pointsEarned: number | null;
    createdAt: string;
    updatedAt: string | null;
}

export interface SubmitPredictionRequest {
    leagueId: string;
    matchId: string;
    homeScore: number;
    awayScore: number;
}

export interface TournamentDto {
    id: string;
    name: string | null;
    year: number;
    startDate: string;
    endDate: string;
    country: string | null;
    logoUrl: string | null;
    isActive: boolean;
}

export interface LeagueStandingDto {
    userId: string;
    username: string | null;
    rank: number;
    totalPoints: number;
    matchPoints: number;
    bonusPoints: number;
    avatarUrl: string | null;
}


// --- API Client ---

async function fetchApi<T>(endpoint: string, token: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    // Only set Content-Type to json if body is NOT FormData (browser sets multipart boundary for FormData)
    if (!(options.body instanceof FormData)) {
        // @ts-ignore - simple check
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}/api/${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${endpoint}:`, response.status, errorText);
        throw new Error(`API Error: ${response.status} ${errorText}`);
    }

    // Handle void responses or empty bodies if necessary, but most here seem to return JSON wrapper
    // The swagger says everything returns { isSuccess, data, error } usually? 
    // Wait, the Swagger says responses like CurrentUserResponseResult which has { data: ... }
    // We should unwrap that if possible, or just return the raw result. 
    // Let's look at CurrentUserResponseResult structure from swagger:
    // { isSuccess: boolean, error: Error, data: CurrentUserResponse }

    const result = await response.json();
    // Simple unwrapping if it follows the Result pattern
    if (result && typeof result === 'object' && 'isSuccess' in result) {
        if (!result.isSuccess) {
            throw new Error(result.error?.message || 'Unknown API Error');
        }
        return result.data as T;
    }

    return result as T;
}

export const api = {
    auth: {
        me: (token: string) => fetchApi<CurrentUserResponse>('auth/me', token),
    },
    users: {
        uploadAvatar: (token: string, file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            return fetchApi<string>('users/avatar', token, {
                method: 'POST',
                body: formData
            });
        }
    },
    leagues: {
        list: (token: string) => fetchApi<LeagueDto[]>('leagues', token),
        get: (token: string, id: string) => fetchApi<LeagueDto>(`leagues/${id}`, token),
        create: (token: string, data: CreateLeagueRequest) => fetchApi<string>('leagues', token, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        join: (token: string, id: string, inviteCode?: string) => fetchApi<boolean>(`leagues/${id}/join`, token, {
            method: 'POST',
            body: JSON.stringify({ inviteCode: inviteCode || "" })
        }),
        leave: (token: string, id: string) => fetchApi<boolean>(`leagues/${id}/leave`, token, {
            method: 'POST'
        }),
        delete: (token: string, id: string) => fetchApi<boolean>(`leagues/${id}`, token, {
            method: 'DELETE'
        }),
        standings: (token: string, id: string) => fetchApi<LeagueStandingDto[]>(`leagues/${id}/standings`, token),
        updateSettings: (token: string, id: string, settings: Partial<LeagueSettingsDto>) => fetchApi<LeagueSettingsDto>(`leagues/${id}/settings`, token, {
            method: 'PUT',
            body: JSON.stringify(settings)
        })
    },
    matches: {
        list: (token: string, tournamentId?: string, date?: string) => {
            const params = new URLSearchParams();
            if (tournamentId) params.append('tournamentId', tournamentId);
            if (date) params.append('date', date);
            return fetchApi<MatchDto[]>(`matches?${params.toString()}`, token);
        }
    },
    predictions: {
        submit: (token: string, data: SubmitPredictionRequest) => fetchApi<string>('predictions', token, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        list: (token: string, leagueId?: string) => {
            const params = new URLSearchParams();
            if (leagueId) params.append('leagueId', leagueId);
            return fetchApi<PredictionDto[]>(`predictions?${params.toString()}`, token);
        }
    },
    tournaments: {
        list: (token: string, onlyActive: boolean = false) => fetchApi<TournamentDto[]>(`tournaments?onlyActive=${onlyActive}`, token),
        getTeams: (token: string, tournamentId: string) => fetchApi<TeamDto[]>(`teams?tournamentId=${tournamentId}`, token)
    }
};

// Keep the old syncUser for compatibility if needed, but define it via new client
export async function syncUser(accessToken: string) {
    return api.auth.me(accessToken);
}
