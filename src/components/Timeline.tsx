import { UserPlus, Users, Trophy } from 'lucide-react'

export function Timeline() {
  const steps = [
    {
      title: "Skapa liga",
      description: "Sätt upp din liga på 30 sekunder. Välj namn och vilka regler som ska gälla.",
      icon: <UserPlus className="w-6 h-6 text-white" />,
      color: "bg-emerald-500",
      shadow: "shadow-emerald-500/20"
    },
    {
      title: "Bjud in vänner",
      description: "Dela en unik länk. Dina vänner klickar, går med och är redo att tippa direkt.",
      icon: <Users className="w-6 h-6 text-white" />,
      color: "bg-indigo-500",
      shadow: "shadow-indigo-500/20"
    },
    {
      title: "Avgörandet",
      description: "Luta dig tillbaka och se poängen trilla in live medan matcherna spelas.",
      icon: <Trophy className="w-6 h-6 text-white" />,
      color: "bg-amber-500",
      shadow: "shadow-amber-500/20"
    }
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
             <h2 className="text-3xl lg:text-4xl font-bold mb-4">Så funkar det</h2>
             <p className="text-muted-foreground text-lg">Från idé till mästare på tre enkla steg.</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
            {/* Connecting Curving Line (Desktop) */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500 hidden md:block -translate-y-1/2 rounded-full opacity-20" />
            
            <div className="grid md:grid-cols-3 gap-12 relative">
                {steps.map((step, i) => (
                    <div key={i} className="relative group">
                        {/* Hover Card Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-3xl -z-10 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 border border-white/50 shadow-xl" />
                        
                        <div className="text-center p-6 relative z-10">
                            {/* Icon Bubble */}
                            <div className={`w-16 h-16 mx-auto ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${step.shadow} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                                {step.icon}
                            </div>
                            
                            {/* Step Number Badge */}
                            <div className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold mb-4 border border-secondary/20">
                                Steg {i + 1}
                            </div>

                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      {/* Background Blobs */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10 -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10 -translate-y-1/2" />
    </section>
  )
}
