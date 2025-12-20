import { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { Send, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Changed to Textarea
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/UserAvatar";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { chatService, type ChatMessage } from "@/services/chatService";
import { useLeagueStandings } from "@/hooks/api"; // Added hook

interface LeagueChatPanelProps {
    leagueId: string;
}

export function LeagueChatPanel({ leagueId }: LeagueChatPanelProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [inputText, setInputText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

    // Fetch standings to get ranks
    const { data: standings } = useLeagueStandings(leagueId);

    const rankMap = useMemo(() => {
        if (!standings) return {};
        const map: Record<string, number> = {};
        standings.forEach(user => {
            map[user.userId] = user.rank;
        });
        return map;
    }, [standings]);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setCurrentUser(data.user);
        });
    }, []);

    useEffect(() => {
        let mounted = true;
        let newConnection: HubConnection | null = null;

        const init = async () => {
            setIsInitializing(true);
            setError(null);
            setMessages([]);
            setNextCursor(null);

            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.access_token) {
                    setError("Du måste vara inloggad för att se chatten.");
                    setIsInitializing(false);
                    return;
                }

                const token = session.access_token;

                try {
                    const history = await chatService.fetchMessages(leagueId, null, 50, token);
                    if (mounted) {
                        const sorted = history.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                        setMessages(sorted);
                        setNextCursor(history.nextCursor);
                        setShouldAutoScroll(true); // Force scroll to bottom on init
                    }
                } catch (err: any) {
                    if (mounted) setError(err.message || "Kunde inte hämta meddelanden.");
                    setIsInitializing(false);
                    return;
                }

                newConnection = chatService.createConnection(token);

                newConnection.on("MessageReceived", (message: ChatMessage) => {
                    if (mounted) {
                        setMessages((prev) => {
                            if (prev.some((m) => m.id === message.id)) return prev;
                            setShouldAutoScroll(true); // Auto-scroll on new message
                            return [...prev, message];
                        });
                    }
                });

                newConnection.onreconnected(() => {
                    console.log("Reconnected");
                    chatService.joinLeagueChat(newConnection!, leagueId).catch(console.error);
                });

                await newConnection.start();
                await chatService.joinLeagueChat(newConnection, leagueId);

                if (mounted) {
                    setConnection(newConnection);
                    setIsInitializing(false);
                }

            } catch (err: any) {
                console.error("Chat init error:", err);
                if (mounted) {
                    setError("Kunde inte ansluta till chatten.");
                    setIsInitializing(false);
                }
            }
        };

        init();

        return () => {
            mounted = false;
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, [leagueId]);

    const isFirstLoad = useRef(true);

    // Handle scroll position preservation or auto-scroll
    useLayoutEffect(() => {
        // If we just finished initializing, or if we have new messages and should scroll
        if (!isInitializing && shouldAutoScroll && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: isFirstLoad.current ? "auto" : "smooth" });
            setShouldAutoScroll(false);
            if (isFirstLoad.current) {
                isFirstLoad.current = false;
            }
        }
    }, [messages, shouldAutoScroll, isInitializing]);


    const loadMore = async () => {
        if (!nextCursor || isLoading) return;
        setIsLoading(true);

        // Capture current scroll height and scrollTop before adding new messages
        const scrollContainer = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        const oldScrollHeight = scrollContainer?.scrollHeight || 0;
        const oldScrollTop = scrollContainer?.scrollTop || 0;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const result = await chatService.fetchMessages(leagueId, nextCursor, 50, token);

            const sorted = result.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

            // We do NOT want to auto-scroll to bottom when loading history
            setShouldAutoScroll(false);

            setMessages((prev) => [...sorted, ...prev]);
            setNextCursor(result.nextCursor);

            // Restore scroll position after render
            // We use requestAnimationFrame to ensure DOM has updated
            requestAnimationFrame(() => {
                if (scrollContainer) {
                    const newScrollHeight = scrollContainer.scrollHeight;
                    // The change in height is what we added at the top. 
                    // We want to scroll down by that amount to keep the viewport looking at the same messages.
                    const heightDifference = newScrollHeight - oldScrollHeight;
                    scrollContainer.scrollTop = heightDifference + oldScrollTop;
                    // Alternatively: scrollContainer.scrollTop = newScrollHeight - oldScrollHeight; if we were at top 0.
                    // But user might have scrolled a bit down. 
                    // Usually: scrollTop = newScrollHeight - oldScrollHeight if we were at the very top (0).
                }
            });

        } catch (error) {
            toast.error("Kunde inte ladda äldre meddelanden.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || !connection || isSending) return;

        setIsSending(true);
        try {
            const result = await chatService.sendMessage(connection, leagueId, inputText);
            if (!result.isSuccess) {
                toast.error(result.error?.message || "Ett okänt fel inträffade.");
            } else {
                setInputText("");
                setShouldAutoScroll(true);
            }
        } catch (err) {
            console.error(err);
            toast.error("Nätverksfel vid sändning.");
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Shift + Enter should insert newline (default behavior of textarea), so we don't preventDefault.
        // Enter without Shift should send.
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (isInitializing) {
        return (
            <div className="flex h-[400px] items-center justify-center border rounded-lg bg-card">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Ansluter till chat...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[400px] items-center justify-center border rounded-lg bg-card p-6">
                <div className="flex flex-col items-center gap-2 text-destructive text-center">
                    <AlertCircle className="h-8 w-8" />
                    <p>{error}</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>Försök igen</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] border rounded-lg bg-card overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b bg-muted/20 flex items-center justify-between shadow-sm z-10">
                <h3 className="font-semibold text-sm">Ligachatt</h3>
                <div className={`text-xs flex items-center gap-1.5 ${connection?.state === HubConnectionState.Connected ? 'text-emerald-600' : 'text-amber-600'}`}>
                    <span className={`h-2 w-2 rounded-full ${connection?.state === HubConnectionState.Connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {connection?.state === HubConnectionState.Connected ? 'Live' : 'Ansluter...'}
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                {nextCursor && (
                    <div className="flex justify-center mb-4">
                        <Button variant="ghost" size="sm" onClick={loadMore} disabled={isLoading} className="text-xs">
                            {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                            Ladda äldre
                        </Button>
                    </div>
                )}

                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm py-8">
                            Inga meddelanden än. Bli den första som skriver något!
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMyMessage = currentUser && msg.userId === currentUser.id;
                            const rank = rankMap[msg.userId];

                            return (
                                <div key={msg.id} className={`flex gap-3 ${isMyMessage ? 'flex-row-reverse' : ''}`}>
                                    <UserAvatar
                                        user={{
                                            username: msg.username,
                                            avatarUrl: msg.avatarUrl
                                        }}
                                        className="h-8 w-8 mt-1 border ring-2 ring-background"
                                    />
                                    <div className={`flex flex-col max-w-[85%] ${isMyMessage ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-semibold text-foreground/80">{msg.username}</span>
                                                {rank && (
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${rank === 1 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                        rank === 2 ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                                                            rank === 3 ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                                                'bg-muted text-muted-foreground'
                                                        }`}>
                                                        #{rank}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">{format(new Date(msg.createdAt), 'HH:mm', { locale: sv })}</span>
                                        </div>
                                        <div className={`rounded-2xl px-3 py-2 text-sm shadow-sm whitespace-pre-wrap break-words ${isMyMessage
                                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                                            : 'bg-muted rounded-tl-none border'
                                            }`}>
                                            {msg.message}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t bg-muted/10">
                <div className="flex gap-2 items-end">
                    <Textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Skriv ett meddelande..."
                        disabled={connection?.state !== HubConnectionState.Connected}
                        className="flex-1 min-h-[44px] max-h-[120px] resize-none py-3"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!inputText.trim() || connection?.state !== HubConnectionState.Connected || isSending}
                        size="icon"
                        className="h-11 w-11 shrink-0"
                    >
                        {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                </div>
                <div className="text-[10px] text-muted-foreground mt-2 ml-1 hidden sm:block">
                    Shift + Enter för ny rad
                </div>
            </div>
        </div>
    );
}
