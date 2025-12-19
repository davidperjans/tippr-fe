import { useMatches, useTournaments } from '../hooks/api'

type MarqueeItem =
  | { type: 'match'; id: string; text: string; subtext: string; logo1: string | null; logo2: string | null; score?: string }
  | { type: 'tournament'; id: string; text: string; logo1: string | null }

export function TournamentMarquee() {
  const { data: tournaments } = useTournaments(true)
  const activeTournament = tournaments?.[0]
  const { data: matches } = useMatches(activeTournament?.id)

  const liveMatches = matches || []

  // Combine logic: if we have live matches, show them. Otherwise show tournaments
  const items: MarqueeItem[] = liveMatches.length > 0
    ? liveMatches.map(m => {
      const date = new Date(m.matchDate)
      const subtext = new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date)
      return {
        id: m.id,
        type: 'match',
        text: `${m.homeTeamName || 'Unknown'} vs ${m.awayTeamName || 'Unknown'}`,
        subtext,
        logo1: m.homeTeamLogoUrl,
        logo2: m.awayTeamLogoUrl,
        score: m.status !== 0 ? `${m.homeScore ?? 0} - ${m.awayScore ?? 0}` : undefined
      }
    })
    : [
      { name: "Champions League", logo: "https://media.api-sports.io/football/leagues/2.png" },
      { name: "Europa League", logo: "https://media.api-sports.io/football/leagues/3.png" },
      { name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png" },
      { name: "La Liga", logo: "https://media.api-sports.io/football/leagues/140.png" },
      { name: "Serie A", logo: "https://assets.football-logos.cc/logos/italy/512x512/serie-a.1289b16a.png" },
      { name: "Allsvenskan", logo: "https://media.api-sports.io/football/leagues/113.png" },
    ].map(t => ({ id: t.name, type: 'tournament', text: t.name, logo1: t.logo }))

  if (items.length === 0) return null

  return (
    <div className="w-full bg-muted/30 border-y border-border/50 py-3 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-8 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-8 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {/* Quadruple the list to ensure seamless infinite scroll */}
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex items-center gap-3 mx-6 md:mx-8 shrink-0 group select-none"
          >
            {item.type === 'match' ? (
              <div className="flex items-center gap-3 bg-card/50 px-3 py-1.5 rounded-full border border-border/50 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <img src={item.logo1 || ''} alt="" className="w-6 h-6 object-contain" />
                  <span className="text-sm font-semibold">{item.score ? item.score : 'VS'}</span>
                  <img src={item.logo2 || ''} alt="" className="w-6 h-6 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium whitespace-nowrap">{item.text}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">{item.subtext}</span>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={item.logo1 || ''}
                  alt={item.text}
                  className="h-8 w-auto object-contain max-w-[60px] opacity-70 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"
                />
              </>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee ${items.length * 10}s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  )
}
