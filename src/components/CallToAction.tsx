import { ArrowRight } from 'lucide-react'

export function CallToAction() {
  return (
    <section className="py-24 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald-600 to-teal-800 -z-20" />
        
        {/* Decorative Patterns */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay -z-10" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="container mx-auto px-4 text-center text-white relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Redo att kora mästaren?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                Det tar mindre än en minut att komma igång. Skapa din liga nu och bjud in vännerna innan avspark.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/signup" className="w-full sm:w-auto px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-white/90 transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group">
                    Starta liga gratis
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
            
            <p className="mt-8 text-sm text-white/40">
                Och ja, det är helt gratis att använda.
            </p>
        </div>

        {/* Glow Effects */}
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-400/20 rounded-full blur-[128px] pointer-events-none" />
    </section>
  )
}
