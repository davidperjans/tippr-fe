import { type MatchDto, MatchStage, MatchStatus } from "@/lib/api"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { sv } from "date-fns/locale"
import { Trophy } from "lucide-react"

interface PlayoffBracketProps {
    matches: MatchDto[]
}

const STAGES = [
    { id: MatchStage.RoundOf16, label: "Åttondelsfinal", count: 8 },
    { id: MatchStage.QuarterFinal, label: "Kvartsfinal", count: 4 },
    { id: MatchStage.SemiFinal, label: "Semifinal", count: 2 },
    { id: MatchStage.Final, label: "Final", count: 1 },
] as const

const CARD_H = 76
const BASE_GAP = 24
const CARD_W = 260
const CONNECTOR_W = 56
const WINNER_W = 220
const GRID_GAP_X = 24
const GRID_GAP_Y = 12

type StageMap = Record<MatchStage, (MatchDto | null)[]>

export function PlayoffBracket({ matches }: PlayoffBracketProps) {
    const matchesByStage: StageMap = STAGES.reduce((acc, stage) => {
        const stageMatches = matches
            .filter(m => m.stage === stage.id)
            .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())

        acc[stage.id] = Array.from({ length: stage.count }, (_, i) => stageMatches[i] ?? null)
        return acc
    }, {} as StageMap)

    const step = CARD_H + BASE_GAP
    const totalHeight = (STAGES[0].count - 1) * step + CARD_H

    const topFor = (stageIndex: number, matchIndex: number) => {
        const scale = 2 ** stageIndex
        const offset = (step * (scale - 1)) / 2
        return matchIndex * step * scale + offset
    }

    const centerYFor = (stageIndex: number, matchIndex: number) => topFor(stageIndex, matchIndex) + CARD_H / 2

    const finalMatch = matchesByStage[MatchStage.Final]?.[0]
    const winner =
        finalMatch && finalMatch.status === MatchStatus.Finished
            ? (finalMatch.homeScore ?? 0) > (finalMatch.awayScore ?? 0)
                ? { name: finalMatch.homeTeamName, logo: finalMatch.homeTeamLogoUrl }
                : (finalMatch.awayScore ?? 0) > (finalMatch.homeScore ?? 0)
                    ? { name: finalMatch.awayTeamName, logo: finalMatch.awayTeamLogoUrl }
                    : null
            : null

    // Grid columns: Stage, Connector, Stage, Connector, Stage, Connector, Stage, Winner
    const gridTemplateColumns = [
        `${CARD_W}px`, `${CONNECTOR_W}px`,
        `${CARD_W}px`, `${CONNECTOR_W}px`,
        `${CARD_W}px`, `${CONNECTOR_W}px`,
        `${CARD_W}px`,
        `${WINNER_W}px`,
    ].join(" ")

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-max p-4">
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns,
                        columnGap: GRID_GAP_X,
                        rowGap: GRID_GAP_Y,
                        alignItems: "start",
                    }}
                >
                    {/* Row 1: headers */}
                    {STAGES.map((s, i) => (
                        <div key={`h-${s.id}`} style={{ gridColumn: i * 2 + 1 }} className="text-sm font-semibold text-foreground/90">
                            {s.label}
                        </div>
                    ))}
                    {/* empty header cells for connector columns */}
                    {[0, 1, 2].map(i => (
                        <div key={`hc-${i}`} style={{ gridColumn: i * 2 + 2 }} />
                    ))}
                    <div style={{ gridColumn: 8 }} className="text-sm font-semibold text-foreground/90">
                        Mästare
                    </div>

                    {/* Row 2: bracket (all relative containers share SAME y=0 origin) */}
                    {STAGES.map((stage, stageIndex) => {
                        const items = matchesByStage[stage.id] ?? []
                        const isLast = stageIndex === STAGES.length - 1

                        return (
                            <div
                                key={`col-${stage.id}`}
                                style={{ gridColumn: stageIndex * 2 + 1 }}
                                className="relative"
                            >
                                <div className="relative" style={{ height: totalHeight, width: CARD_W }}>
                                    {items.map((match, idx) => (
                                        <div
                                            key={`${stage.id}-${idx}`}
                                            className="absolute left-0"
                                            style={{ top: topFor(stageIndex, idx), width: CARD_W, height: CARD_H }}
                                        >
                                            <MatchCard match={match} isFinal={stage.id === MatchStage.Final} />
                                        </div>
                                    ))}
                                </div>

                                {/* connector column to the right (except for Final) */}
                                {!isLast && (
                                    <div
                                        className="absolute top-0"
                                        style={{
                                            left: CARD_W + GRID_GAP_X / 2, // visually centered in the grid gap area
                                            width: CONNECTOR_W,
                                            height: totalHeight,
                                        }}
                                    >
                                        {Array.from({ length: Math.ceil(items.length / 2) }).map((_, pairIndex) => {
                                            const topIdx = pairIndex * 2
                                            const botIdx = pairIndex * 2 + 1

                                            const yTop = centerYFor(stageIndex, topIdx)
                                            const yBot = centerYFor(stageIndex, botIdx)
                                            const yNext = centerYFor(stageIndex + 1, pairIndex)

                                            return (
                                                <ConnectorCenters
                                                    key={`c-${stage.id}-${pairIndex}`}
                                                    yTop={yTop}
                                                    yBot={yBot}
                                                    yNext={yNext}
                                                    width={CONNECTOR_W}
                                                />
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {/* Winner column */}
                    <div style={{ gridColumn: 8 }} className="relative">
                        <div className="relative" style={{ height: totalHeight, width: WINNER_W }}>
                            <div className="absolute left-0 top-0 flex h-[120px] w-full items-center justify-center rounded-xl border border-border/60 bg-card/40 px-4">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <div className="inline-flex items-center gap-2 text-sm text-foreground/80">
                                        <Trophy className="h-4 w-4" />
                                        Vinnare
                                    </div>

                                    {winner ? (
                                        <div className="flex items-center gap-2">
                                            {winner.logo ? (
                                                <img src={winner.logo} alt={winner.name} className="h-7 w-7 rounded bg-white/5 object-contain" />
                                            ) : (
                                                <div className="h-7 w-7 rounded bg-white/5" />
                                            )}
                                            <div className="text-base font-semibold">{winner.name}</div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">—</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Draws:
 * (0,yTop) -> (xMid,yTop) -> (xMid,yNext) -> (width,yNext)
 * (0,yBot) -> (xMid,yBot) -> (xMid,yNext)
 *
 * So it is ALWAYS center(card) -> center(next card).
 */
function ConnectorCenters({
    yTop,
    yBot,
    yNext,
    width,
}: {
    yTop: number
    yBot: number
    yNext: number
    width: number
}) {
    const minY = Math.min(yTop, yBot, yNext)
    const maxY = Math.max(yTop, yBot, yNext)
    const h = Math.max(1, maxY - minY)

    const yT = yTop - minY
    const yB = yBot - minY
    const yN = yNext - minY

    const x0 = 0
    const xMid = Math.floor(width * 0.55)
    const xEnd = width

    return (
        <svg
            className="absolute left-0 text-foreground/30"
            style={{ top: minY, width, height: h }}
            viewBox={`0 0 ${width} ${h}`}
            preserveAspectRatio="none"
        >
            <path
                d={`M ${x0} ${yT} H ${xMid} V ${yN} H ${xEnd}`}
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d={`M ${x0} ${yB} H ${xMid} V ${yN}`}
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function MatchCard({ match, isFinal }: { match: MatchDto | null; isFinal?: boolean }) {
    // IMPORTANT: fixed height via wrapper above (CARD_H),
    // but keep card content from expanding height.
    if (!match) {
        return (
            <div className="h-full w-full rounded-xl border border-border/50 bg-card/30 p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded bg-white/5" />
                        <div className="text-sm text-muted-foreground">TBD</div>
                    </div>
                    <div className="text-sm text-muted-foreground">-</div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded bg-white/5" />
                        <div className="text-sm text-muted-foreground">TBD</div>
                    </div>
                    <div className="text-sm text-muted-foreground">-</div>
                </div>
            </div>
        )
    }

    const isFinished = match.status === MatchStatus.Finished
    const isLive = match.status === MatchStatus.InProgress
    const isUpcoming = match.status === MatchStatus.Scheduled

    const homeWins = isFinished && (match.homeScore ?? 0) > (match.awayScore ?? 0)
    const awayWins = isFinished && (match.awayScore ?? 0) > (match.homeScore ?? 0)

    return (
        <div className={cn("relative h-full w-full rounded-xl border p-3", isFinal ? "border-border/70 bg-card/50" : "border-border/50 bg-card/30")}>
            {isLive && (
                <div className="absolute right-3 top-3 rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-red-200">
                    LIVE
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-2">
                    {match.homeTeamLogoUrl ? (
                        <img src={match.homeTeamLogoUrl} alt={match.homeTeamName} className="h-7 w-7 rounded bg-white/5 object-contain" />
                    ) : (
                        <div className="h-7 w-7 rounded bg-white/5" />
                    )}
                    <div className={cn("truncate text-sm", homeWins && "font-semibold")}>{match.homeTeamName || "TBD"}</div>
                </div>
                <div className={cn("text-sm tabular-nums", homeWins && "font-semibold")}>{match.homeScore ?? "-"}</div>
            </div>

            <div className="mt-2 flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-2">
                    {match.awayTeamLogoUrl ? (
                        <img src={match.awayTeamLogoUrl} alt={match.awayTeamName} className="h-7 w-7 rounded bg-white/5 object-contain" />
                    ) : (
                        <div className="h-7 w-7 rounded bg-white/5" />
                    )}
                    <div className={cn("truncate text-sm", awayWins && "font-semibold")}>{match.awayTeamName || "TBD"}</div>
                </div>
                <div className={cn("text-sm tabular-nums", awayWins && "font-semibold")}>{match.awayScore ?? "-"}</div>
            </div>

            {isUpcoming && match.matchDate && (
                <div className="mt-2 text-xs text-muted-foreground">
                    {format(new Date(match.matchDate), "d MMM HH:mm", { locale: sv })}
                </div>
            )}
        </div>
    )
}
