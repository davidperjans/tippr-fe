

export function BracketBackground() {
  // Static mock data for decoration
  const leftBracket = {
    roundOf16: [
      { id: 1, team1: 'Sverige', team2: 'Mexiko' },
      { id: 2, team1: 'Tyskland', team2: 'Japan' },
      { id: 3, team1: 'Frankrike', team2: 'Polen' },
      { id: 4, team1: 'England', team2: 'Senegal' },
    ],
    quarterFinals: [
      { id: 9, team1: 'Tyskland', team2: 'Sverige' },
      { id: 10, team1: 'Frankrike', team2: 'Englad' },
    ],
    semiFinal: [
      { id: 13, team1: 'Frankrike', team2: 'Tyskland' },
    ],
  }

  const rightBracket = {
    roundOf16: [
      { id: 5, team1: 'Brasilien', team2: 'Sydkorea' },
      { id: 6, team1: 'Argentina', team2: 'Australien' },
      { id: 7, team1: 'Nederländerna', team2: 'USA' },
      { id: 8, team1: 'Kroatien', team2: 'Spanien' },
    ],
    quarterFinals: [
      { id: 11, team1: 'Argentina', team2: 'Brasilien' },
      { id: 12, team1: 'Nederländerna', team2: 'Kroatien' },
    ],
    semiFinal: [
      { id: 14, team1: 'Argentina', team2: 'Nederländerna' },
    ],
  }

  const MatchCard = ({ team1, team2 }: { team1: string; team2: string }) => (
    <div className="relative bg-card/60 border border-border/40 rounded overflow-hidden text-[10px] grayscale hover:grayscale-0 transition-all duration-500 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-2 py-1 border-b border-border/10">
        <div className="w-3 h-3 rounded-full bg-muted/50" />
        <span className="font-medium truncate text-muted-foreground">{team1}</span>
      </div>
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="w-3 h-3 rounded-full bg-muted/50" />
        <span className="font-medium truncate text-muted-foreground">{team2}</span>
      </div>
    </div>
  )

  const Connector = ({ side }: { side: 'left' | 'right' }) => (
    <div className="flex items-center h-full w-4 opacity-50">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 32 100">
        {side === 'left' ? (
          <path d="M0 25 H16 V50 H32 M0 75 H16 V50" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        ) : (
          <path d="M32 25 H16 V50 H0 M32 75 H16 V50" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        )}
      </svg>
    </div>
  )

  return (
    <div className="absolute inset-x-0 -top-40 -bottom-40 overflow-hidden pointer-events-none select-none z-0 opacity-[0.35]">
      {/* Radial Mask to fade out center for readability */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at center, transparent 20%, hsl(var(--background)) 100%)',
          maskImage: 'radial-gradient(circle at center, transparent 40%, black 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, transparent 40%, black 100%)'
        }}
      />
      
      <div className="container mx-auto h-full flex items-center justify-center">
         {/* 3D Perspective Container */}
         <div 
            className="flex items-center justify-center min-w-[1200px] h-[800px] gap-8 transform-gpu"
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
            }}
         >
            {/* Tilted Content */}
            <div 
                className="flex items-center justify-center gap-8 w-full h-full will-change-transform"
                style={{
                     transform: 'rotateX(20deg) scale(0.9) translateZ(0)',
                }}
            >

                {/* LEFT SIDE */}
                <div className="flex gap-4 h-full">
                    {/* R16 */}
                    <div className="flex flex-col justify-around py-4 w-40">
                        {leftBracket.roundOf16.map(m => <MatchCard key={m.id} team1={m.team1} team2={m.team2} />)}
                    </div>
                    <div className="flex flex-col justify-around h-full py-16">
                        <Connector side="left" />
                        <Connector side="left" />
                    </div>
                    {/* QF */}
                    <div className="flex flex-col justify-around py-32 w-40">
                        {leftBracket.quarterFinals.map(m => <MatchCard key={m.id} team1={m.team1} team2={m.team2} />)}
                    </div>
                    <div className="flex items-center h-full">
                        <Connector side="left" />
                    </div>
                     {/* SF */}
                     <div className="flex flex-col justify-center w-40">
                        <MatchCard team1={leftBracket.semiFinal[0].team1} team2={leftBracket.semiFinal[0].team2} />
                    </div>
                </div>

                {/* CENTER SPACE (Kept empty for text) */}
                <div className="w-96" />

                {/* RIGHT SIDE */}
                <div className="flex gap-4 h-full flex-row-reverse">
                    {/* R16 */}
                    <div className="flex flex-col justify-around py-4 w-40">
                        {rightBracket.roundOf16.map(m => <MatchCard key={m.id} team1={m.team1} team2={m.team2} />)}
                    </div>
                    <div className="flex flex-col justify-around h-full py-16">
                        <Connector side="right" />
                        <Connector side="right" />
                    </div>
                    {/* QF */}
                    <div className="flex flex-col justify-around py-32 w-40">
                        {rightBracket.quarterFinals.map(m => <MatchCard key={m.id} team1={m.team1} team2={m.team2} />)}
                    </div>
                    <div className="flex items-center h-full">
                        <Connector side="right" />
                    </div>
                     {/* SF */}
                     <div className="flex flex-col justify-center w-40">
                        <MatchCard team1={rightBracket.semiFinal[0].team1} team2={rightBracket.semiFinal[0].team2} />
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  )
}
