import { BarChart3, Zap, Settings, Bell, ChevronRight } from 'lucide-react'

export function BentoFeatures() {
  return (
    <section id="features" className="py-24 bg-card/30 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Mästerskapet gjort enkelt</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Vi har skalat bort allt onödigt och lagt krutet på det som faktiskt betyder något: spänningen, gemenskapen och äran.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {/* Card 1: Statistics (Large Span) */}
          <div className="md:col-span-2 bg-gradient-to-br from-background to-muted border rounded-3xl p-6 overflow-hidden relative group hover:shadow-xl transition-all duration-500">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold mb-2">Djupgående Statistik</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                  Följ din utveckling med detaljerad data. Se vem som har bäst "hit rate" på skrällar och vem som fegar.
                </p>
              </div>
              
              {/* Mini Chart Visual */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border w-full max-w-sm self-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-end justify-between h-24 gap-1.5 px-2 pb-2">
                    {[40, 70, 45, 90, 60, 85, 50].map((height, i) => (
                        <div key={i} className="w-full h-full bg-indigo-500/20 rounded-t-sm relative group/bar overflow-hidden">
                            <div 
                                className="absolute bottom-0 left-0 right-0 bg-indigo-500 transition-all duration-1000 ease-out group-hover:animate-pulse"
                                style={{ height: `${height}%`, transitionDelay: `${i * 100}ms` }}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground px-1 mt-1 font-mono">
                    <span>MÅN</span>
                    <span>TIS</span>
                    <span>ONS</span>
                    <span>TOR</span>
                    <span>FRE</span>
                    <span>LÖR</span>
                    <span>SÖN</span>
                </div>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 p-24 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
          </div>

          {/* Card 2: Notifications (Tall) */}
          <div className="md:row-span-2 bg-gradient-to-br from-background to-muted border rounded-3xl p-6 overflow-hidden relative group hover:shadow-xl transition-all duration-500 flex flex-col">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-4 text-amber-600 group-hover:scale-110 transition-transform duration-300">
               <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold mb-2">Missa aldrig ett mål</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
               Få notiser direkt när det händer. "Erik gick precis om dig!" är den värsta (och bästa) notisen.
            </p>

            {/* Notification Visuals */}
            <div className="mt-auto space-y-3 relative">
                <div className="bg-white border rounded-2xl p-3 shadow-sm transform group-hover:-translate-y-2 transition-transform duration-500 delay-100">
                   <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">T</div>
                      <div className="min-w-0">
                         <p className="text-[10px] font-bold text-muted-foreground mb-0.5">Tippr • Nu</p>
                         <p className="text-xs font-medium leading-tight truncate">MÅL! ⚽️ Mbappe gör 1-0.</p>
                      </div>
                   </div>
                </div>
                <div className="bg-white border rounded-2xl p-3 shadow-sm transform scale-95 opacity-80 group-hover:-translate-y-2 transition-transform duration-500 delay-200">
                   <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">T</div>
                      <div className="min-w-0">
                         <p className="text-[10px] font-bold text-muted-foreground mb-0.5">Tippr • 2 min</p>
                         <p className="text-xs font-medium leading-tight truncate">Du tappade 1:a platsen 📉</p>
                      </div>
                   </div>
                </div>
            </div>
          </div>

          {/* Card 3: Settings/Customization */}
          <div className="bg-gradient-to-br from-background to-muted border rounded-3xl p-6 overflow-hidden relative group hover:shadow-xl transition-all duration-500">
             <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-5 h-5" />
             </div>
             <h3 className="text-lg font-bold mb-2">Era regler</h3>
             <p className="text-muted-foreground text-sm mb-4">
                Skräddarsy poängen. 
             </p>
             
             {/* Toggles Visual */}
             <div className="space-y-2">
                {[
                    { label: "Poäng för 1X2", on: true },
                    { label: "Bonus för målskytt", on: false },
                    { label: "Slutspels-boost", on: true }
                ].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/50 border rounded-lg p-2">
                        <span className="text-xs font-medium">{setting.label}</span>
                        <div className={`w-7 h-4 rounded-full relative transition-colors duration-300 ${setting.on ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${setting.on ? 'left-3.5' : 'left-0.5'}`} />
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Card 4: Quick Play */}
           <div className="bg-gradient-to-br from-primary to-emerald-600 border border-transparent rounded-3xl p-6 overflow-hidden relative group hover:shadow-xl transition-all duration-500 text-white">
             <div className="flex flex-col h-full justify-between relative z-10">
                <div>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Supersnabbt</h3>
                    <p className="text-white/80 text-sm">
                        Tippa hela omgången på bussen.
                    </p>
                </div>
                <div className="mt-4 flex items-center gap-2 font-bold text-sm cursor-pointer group-hover:translate-x-2 transition-transform">
                    Kom igång <ChevronRight className="w-4 h-4" />
                </div>
             </div>
             {/* Decorative circles */}
             <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
             <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 rounded-full blur-xl animate-pulse" />
          </div>

        </div>
      </div>
    </section>
  )
}
