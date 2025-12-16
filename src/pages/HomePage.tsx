
import { TournamentMarquee } from '../components/TournamentMarquee'
import { MockLeaderboard } from '../components/MockLeaderboard'
import { BentoFeatures } from '../components/BentoFeatures'
import { Timeline } from '../components/Timeline'
import { FAQ } from '../components/FAQ'
import { CallToAction } from '../components/CallToAction'
import { ArrowRight } from 'lucide-react'

export function HomePage() {
  // Landing Page View
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Navigation / Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
              T
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Tippr
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Logga in
            </a>
            <a href="/signup" className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5">
              Kom igång
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
          {/* Background Image (Static Performance Fix) */}
      <div className="fixed inset-0 -z-30">
        <img 
            src="https://images.unsplash.com/photo-1434648957308-5e6a859697e8?q=80&w=2874&auto=format&fit=crop" 
            alt="Stadium Background" 
            className="w-full h-full object-cover opacity-20 grayscale brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/50" />
      </div>
          
          <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              Lanseras inför Fotbolls-VM 2026
            </span>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-foreground animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Tippa smartare. <br/>
              <span className="text-primary relative inline-block">
                Tävla tillsammans.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Släng Excel-arket i papperskorgen. Tippr är den moderna plattformen för att tippa mästerskap med vänner, kollegor och familj. Helt gratis.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <a href="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-semibold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 flex items-center justify-center gap-2 group">
                Skapa en liga
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white border border-border text-foreground rounded-2xl font-semibold text-lg hover:bg-muted/50 transition-all hover:-translate-y-1">
                Hur funkar det?
              </a>
            </div>
          </div>
        </section>

        {/* Marquee Section */}
        <TournamentMarquee />

        {/* Leaderboard Split Section */}
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Visual (Left) */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl rounded-full opacity-50 animate-pulse" />
                        <MockLeaderboard />
                    </div>

                    {/* Content (Right) */}
                    <div className="w-full lg:w-1/2 text-left">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Tävla mot vännerna</span>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground leading-tight">
                            Vem är egentligen fotbollsexperten?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Starta en privat liga på sekunder och bjud in familjen, polarna eller varför inte kollegorna? Vi sköter all administration, rättning och tabeller automatiskt. Du fokuserar på att håna den som ligger sist.
                        </p>
                        
                        <ul className="space-y-4 mb-8">
                            {[
                                "Live-uppdaterade tabeller i realtid",
                                "Smarta notiser vid mål och resultatskiften",
                                "Chatt och pikar direkt i ligan"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <a href="/signup" className="text-primary font-bold hover:underline inline-flex items-center gap-1">
                            Starta din liga nu <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Bento Grid */}
        <BentoFeatures />

        {/* How it works Timeline */}
        <Timeline />

        {/* FAQ Section */}
        <FAQ />

        {/* Call To Action */}
        <CallToAction />

      </main>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-4 text-center">
           <div className="flex items-center justify-center gap-2 mb-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white font-bold text-xs">T</div>
             <span className="font-bold text-lg">Tippr</span>
           </div>
           <p className="text-sm text-muted-foreground mb-4">
             Tippr &copy; {new Date().getFullYear()}
           </p>
           <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Villkor</a>
              <a href="#" className="hover:text-primary transition-colors">Integritet</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
           </div>
        </div>
      </footer>
    </div>
  )
}

