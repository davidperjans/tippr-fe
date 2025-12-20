import { HubConnectionBuilder, LogLevel, HubConnection, HubConnectionState } from "@microsoft/signalr";

// Use the same API URL logic as in @/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7126';

export interface ChatMessage {
    id: string;
    leagueId: string;
    userId: string;
    username: string;
    avatarUrl?: string;
    message: string;
    createdAt: string;
}

export interface FetchMessagesResult {
    messages: ChatMessage[];
    nextCursor: string | null;
}

export interface OperationResult<T> {
    isSuccess: boolean;
    value?: T;
    error?: {
        message: string;
        code?: string;
    };
}

export const chatService = {
    async fetchMessages(leagueId: string, cursor?: string | null, take: number = 50, token?: string): Promise<FetchMessagesResult> {
        const params = new URLSearchParams({
            leagueId,
            take: take.toString(),
        });
        if (cursor) {
            params.append("cursor", cursor);
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Use full API_URL
        const response = await fetch(`${API_URL}/api/chat/messages?${params.toString()}`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized");
            if (response.status === 403) throw new Error("Forbidden");
            const text = await response.text();
            console.error("Fetch message error body:", text);
            throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Chat fetch response:", data);

        let resultData = data;

        // Handle Result<T> wrapper
        if (data && typeof data === 'object' && 'isSuccess' in data) {
            if (!data.isSuccess) throw new Error(data.error?.message || "API Error");
            resultData = data.data || data.value;
        }

        // Map backend 'items' to 'messages' if necessary
        if (resultData && Array.isArray(resultData.items)) {
            return {
                messages: resultData.items,
                nextCursor: resultData.nextCursor
            };
        }

        return resultData;
    },

    createConnection(token: string): HubConnection {
        const connection = new HubConnectionBuilder()
            .withUrl(`${API_URL}/hubs/chat`, {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        return connection;
    },

    async joinLeagueChat(connection: HubConnection, leagueId: string) {
        if (connection.state === HubConnectionState.Connected) {
            await connection.invoke("JoinLeagueChat", leagueId);
        }
    },

    async sendMessage(connection: HubConnection, leagueId: string, message: string): Promise<OperationResult<ChatMessage>> {
        if (connection.state === HubConnectionState.Connected) {
            return await connection.invoke("SendMessage", leagueId, message);
        }
        throw new Error("Connection is not established.");
    }
};
