
export function TournamentMarquee() {
  const tournaments = [
    { name: "Champions League", logo: "https://media.api-sports.io/football/leagues/2.png" },
    { name: "Europa League", logo: "https://media.api-sports.io/football/leagues/3.png" },
    { name: "Nations League", logo: "https://media.api-sports.io/football/leagues/5.png"},
    { name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png" },
    { name: "La Liga", logo: "https://media.api-sports.io/football/leagues/140.png" },
    { name: "Serie A", logo: "https://assets.football-logos.cc/logos/italy/512x512/serie-a.1289b16a.png" },
    { name: "Bundesliga", logo: "https://media.api-sports.io/football/leagues/78.png" },
    { name: "Ligue 1", logo: "https://media.api-sports.io/football/leagues/61.png"},
    { name: "Allsvenskan", logo: "https://media.api-sports.io/football/leagues/113.png" },
    { name: "VM 2026", logo: "https://digitalhub.fifa.com/transform/7189acb1-8453-4a14-8248-70ab7a76f372/FWC-26-Logo-for-Countdown?&io=transform:fill&quality=75" },
    { name: "Euro 2024", logo: "https://media.api-sports.io/football/leagues/4.png" },
  ]

  return (
    <div className="w-full bg-muted/30 border-y border-border/50 py-8 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      
      <div className="flex w-max animate-marquee">
        {/* Triple the list to ensure seamless infinite scroll on wide screens */}
        {[...tournaments, ...tournaments, ...tournaments].map((t, index) => (
          <div 
            key={`${t.name}-${index}`} 
            className="flex items-center gap-12 mx-8 opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 group"
          >
             <img 
               src={t.logo} 
               alt={t.name}
               className="h-12 w-auto object-contain max-w-[100px] transition-transform group-hover:scale-110"
               onError={(e) => {
                 // Fallback to text if image fails
                 e.currentTarget.style.display = 'none';
                 e.currentTarget.nextElementSibling?.classList.remove('hidden');
               }}
             />
             <span className="hidden text-xl font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors cursor-default whitespace-nowrap">
              {t.name}
            </span>
          </div>
        ))}
      </div>

       <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        .animate-marquee:hover {
            animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
