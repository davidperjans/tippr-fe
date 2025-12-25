const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7126'

// --- Types based on Swagger ---

export interface CurrentUserResponse {
    userId: string;
    email: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    lastLoginAt: string;
    role: number; // 0 = regular user, 1 = admin
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
    apiFootballId: string | null;
}

export interface TeamDto {
    id: string;
    name: string | null;
    code: string | null;
    flagUrl: string | null;
    groupName: string | null;
    fifaRank: number | null;
    firstColor: string | null;
    secondColor: string | null;
    apiFootballId: string | null;
    displayName: string | null; // Localized name
    logoUrl?: string | null;
}

export interface PlayerDto {
    id: string;
    teamId: string;
    name: string;
    firstName?: string;
    lastName?: string;
    number?: number;
    position?: string;
    photoUrl?: string;
    dateOfBirth?: string;
    age?: number;
    nationality?: string;
    height?: number;
    weight?: number;
    injured?: boolean;
    apiFootballId?: number;
}

export interface PlayerWithTeamDto extends PlayerDto {
    teamName: string;
    teamDisplayName?: string;
    teamLogoUrl?: string;
}

export interface VenueDto {
    id: string;
    name: string;
    city?: string;
    capacity?: number;
    surface?: string;
    imageUrl?: string;
}

export interface GroupStandingDto {
    groupId: string;
    teamId: string;
    team: TeamDto;
    position: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    form?: string;
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

// --- Bulk Prediction Types ---

export interface BulkPredictionItem {
    matchId: string;
    homeScore: number;
    awayScore: number;
}

export interface BulkPredictionsRequest {
    leagueId: string;
    predictions: BulkPredictionItem[];
}

export interface BulkPredictionResult {
    matchId: string;
    predictionId: string;
    success: boolean;
}

export interface BulkPredictionsResponse {
    successCount: number;
    failedCount: number;
    results: BulkPredictionResult[];
}

// --- Admin Types ---

export type UserRole = 0 | 1; // 0 = User, 1 = Admin

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface AdminUserListDto {
    id: string;
    username: string | null;
    displayName: string | null;
    email: string | null;
    avatarUrl: string | null;
    role: UserRole;
    isBanned: boolean;
    lastLoginAt: string | null;
    createdAt: string;
}

export interface AdminUserDto extends AdminUserListDto {
    authUserId: string;
    bio: string | null;
    favoriteTeamId: string | null;
    favoriteTeamName: string | null;
    updatedAt: string;
    leagueCount: number;
    ownedLeagueCount: number;
    predictionCount: number;
}

export interface AdminLeagueListDto {
    id: string;
    name: string | null;
    description: string | null;
    tournamentId: string;
    tournamentName: string | null;
    ownerId: string | null;
    ownerUsername: string | null;
    isPublic: boolean;
    isGlobal: boolean;
    maxMembers: number | null;
    createdAt: string;
    memberCount: number;
}

export interface AdminLeagueDto extends AdminLeagueListDto {
    inviteCode: string | null;
    isSystemCreated: boolean;
    imageUrl: string | null;
    updatedAt: string;
    predictionCount: number;
}

export interface AdminLeagueMemberDto {
    id: string;
    leagueId: string;
    userId: string;
    username: string | null;
    displayName: string | null;
    email: string | null;
    avatarUrl: string | null;
    joinedAt: string;
    isAdmin: boolean;
    isMuted: boolean;
    totalPoints: number;
    rank: number;
}

export interface AdminMatchDto {
    id: string;
    tournamentId: string;
    tournamentName: string | null;
    homeTeamId: string;
    homeTeamName: string | null;
    homeTeamCode: string | null;
    homeTeamFlagUrl: string | null;
    awayTeamId: string;
    awayTeamName: string | null;
    awayTeamCode: string | null;
    awayTeamFlagUrl: string | null;
    matchDate: string;
    stage: MatchStage;
    homeScore: number | null;
    awayScore: number | null;
    status: MatchStatus;
    venue: string | null;
    apiFootballId: number | null;
    resultVersion: number;
    createdAt: string;
    updatedAt: string;
    predictionCount: number;
}

export interface AdminTournamentDto {
    id: string;
    name: string | null;
    year: number;
    type: number;
    startDate: string;
    endDate: string;
    logoUrl: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    teamCount: number;
    matchCount: number;
    leagueCount: number;
    bonusQuestionCount: number;
}

export interface UpdateMatchResultRequest {
    homeScore: number | null;
    awayScore: number | null;
    status: MatchStatus;
}

export interface UpdateUserRoleRequest {
    role: UserRole;
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
        recalculateStandings: (token: string, id: string) => fetchApi<LeagueStandingDto[]>(`leagues/${id}/standings/recalculate`, token, {
            method: 'POST'
        }),
        updateSettings: (token: string, id: string, settings: Partial<LeagueSettingsDto>) => fetchApi<LeagueSettingsDto>(`leagues/${id}/settings`, token, {
            method: 'PUT',
            body: JSON.stringify(settings)
        })
    },
    matches: {
        list: (token: string, tournamentId?: string, date?: string, teamId?: string) => {
            const params = new URLSearchParams();
            if (tournamentId) params.append('tournamentId', tournamentId);
            if (date) params.append('date', date);
            if (teamId) params.append('teamId', teamId);
            return fetchApi<MatchDto[]>(`matches?${params.toString()}`, token);
        },
        get: (token: string, id: string) => fetchApi<MatchDto>(`matches/${id}`, token),
        getByTeam: (token: string, teamId: string) => fetchApi<MatchDto[]>(`matches/by-team/${teamId}`, token)
    },
    predictions: {
        submit: (token: string, data: SubmitPredictionRequest) => fetchApi<string>('predictions', token, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (token: string, id: string, data: { homeScore: number; awayScore: number }) => fetchApi<void>(`predictions/${id}`, token, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        bulk: (token: string, data: BulkPredictionsRequest) => fetchApi<BulkPredictionsResponse>('predictions/bulk', token, {
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
        getTeams: (token: string, tournamentId: string) => fetchApi<TeamDto[]>(`teams?tournamentId=${tournamentId}`, token),
        getStandings: (token: string, tournamentId: string) => fetchApi<GroupStandingDto[]>(`tournaments/${tournamentId}/standings`, token) // Approximated endpoint
    },
    teams: {
        get: (token: string, id: string) => fetchApi<TeamDto>(`teams/${id}`, token),
    },
    players: {
        list: (token: string, tournamentId: string, position?: string, search?: string) => {
            const params = new URLSearchParams();
            params.append('tournamentId', tournamentId);
            if (position) params.append('position', position);
            if (search) params.append('search', search);
            return fetchApi<PlayerWithTeamDto[]>(`players?${params.toString()}`, token);
        },
        get: (token: string, id: string) => fetchApi<PlayerWithTeamDto>(`players/${id}`, token),
        getByTeam: (token: string, teamId: string) => fetchApi<PlayerDto[]>(`players/by-team/${teamId}`, token)
    },
    venues: {
        list: (token: string, tournamentId?: string) => {
            const params = new URLSearchParams();
            if (tournamentId) params.append('tournamentId', tournamentId);
            return fetchApi<VenueDto[]>(`venues?${params.toString()}`, token);
        },
        get: (token: string, id: string) => fetchApi<VenueDto>(`venues/${id}`, token),
        getByTeam: (token: string, teamId: string) => fetchApi<VenueDto>(`venues/by-team/${teamId}`, token),
        getByMatch: (token: string, matchId: string) => fetchApi<VenueDto>(`venues/by-match/${matchId}`, token)
    },
    groups: {
        getStandings: (token: string, groupId: string) => fetchApi<GroupStandingDto[]>(`groups/${groupId}/standings`, token)
    },

    // --- Admin API ---
    admin: {
        users: {
            list: (token: string, params?: { search?: string; page?: number; pageSize?: number; sort?: string }) => {
                const urlParams = new URLSearchParams();
                if (params?.search) urlParams.append('search', params.search);
                if (params?.page) urlParams.append('page', params.page.toString());
                if (params?.pageSize) urlParams.append('pageSize', params.pageSize.toString());
                if (params?.sort) urlParams.append('sort', params.sort);
                return fetchApi<PagedResult<AdminUserListDto>>(`admin/users?${urlParams.toString()}`, token);
            },
            get: (token: string, userId: string) => fetchApi<AdminUserDto>(`admin/users/${userId}`, token),
            update: (token: string, userId: string, data: { username?: string; displayName?: string; email?: string; bio?: string }) =>
                fetchApi<AdminUserDto>(`admin/users/${userId}`, token, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                }),
            updateRole: (token: string, userId: string, role: UserRole) =>
                fetchApi<boolean>(`admin/users/${userId}/roles`, token, {
                    method: 'POST',
                    body: JSON.stringify({ role })
                }),
            ban: (token: string, userId: string) => fetchApi<boolean>(`admin/users/${userId}/ban`, token, { method: 'POST' }),
            unban: (token: string, userId: string) => fetchApi<boolean>(`admin/users/${userId}/unban`, token, { method: 'POST' }),
        },
        leagues: {
            list: (token: string, params?: { search?: string; tournamentId?: string; isPublic?: boolean; page?: number; pageSize?: number }) => {
                const urlParams = new URLSearchParams();
                if (params?.search) urlParams.append('search', params.search);
                if (params?.tournamentId) urlParams.append('tournamentId', params.tournamentId);
                if (params?.isPublic !== undefined) urlParams.append('isPublic', params.isPublic.toString());
                if (params?.page) urlParams.append('page', params.page.toString());
                if (params?.pageSize) urlParams.append('pageSize', params.pageSize.toString());
                return fetchApi<PagedResult<AdminLeagueListDto>>(`admin/leagues?${urlParams.toString()}`, token);
            },
            get: (token: string, leagueId: string) => fetchApi<AdminLeagueDto>(`admin/leagues/${leagueId}`, token),
            getMembers: (token: string, leagueId: string) => fetchApi<AdminLeagueMemberDto[]>(`admin/leagues/${leagueId}/members`, token),
            update: (token: string, leagueId: string, data: Partial<{ name: string; description: string; isPublic: boolean; isGlobal: boolean; maxMembers: number }>) =>
                fetchApi<AdminLeagueDto>(`admin/leagues/${leagueId}`, token, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                }),
            delete: (token: string, leagueId: string) => fetchApi<boolean>(`admin/leagues/${leagueId}`, token, { method: 'DELETE' }),
            removeMember: (token: string, leagueId: string, userId: string) =>
                fetchApi<boolean>(`admin/leagues/${leagueId}/members/${userId}`, token, { method: 'DELETE' }),
            recalculateStandings: (token: string, leagueId: string) =>
                fetchApi<boolean>(`admin/leagues/${leagueId}/standings/recalculate`, token, { method: 'POST' }),
        },
        matches: {
            updateResult: (token: string, matchId: string, data: UpdateMatchResultRequest) =>
                fetchApi<boolean>(`admin/matches/${matchId}/result`, token, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                }),
            recalculate: (token: string, matchId: string) =>
                fetchApi<{ predictionsUpdated: number; leaguesAffected: number }>(`admin/matches/${matchId}/recalculate`, token, { method: 'POST' }),
        },
        tournaments: {
            update: (token: string, tournamentId: string, data: Partial<{ name: string; startDate: string; endDate: string; logoUrl: string }>) =>
                fetchApi<AdminTournamentDto>(`admin/tournaments/${tournamentId}`, token, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                }),
            activate: (token: string, tournamentId: string) =>
                fetchApi<boolean>(`admin/tournaments/${tournamentId}/activate`, token, { method: 'POST' }),
            deactivate: (token: string, tournamentId: string) =>
                fetchApi<boolean>(`admin/tournaments/${tournamentId}/deactivate`, token, { method: 'POST' }),
            recalculateStandings: (token: string, tournamentId: string) =>
                fetchApi<{ leaguesUpdated: number; totalMembersUpdated: number }>(`admin/tournaments/${tournamentId}/standings/recalculate`, token, { method: 'POST' }),
        },
    }
};

// Keep the old syncUser for compatibility if needed, but define it via new client
export async function syncUser(accessToken: string) {
    return api.auth.me(accessToken);
}

