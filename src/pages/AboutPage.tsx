import { ArrowLeft, Linkedin } from 'lucide-react'

export function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <a href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Tillbaka</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                        <img src="/logo.svg" alt="Tippr" className="w-6 h-6" />
                        <span className="font-bold text-lg">Tippr</span>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16 flex justify-center">
                <div className="max-w-2xl w-full space-y-12">

                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Om oss</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Tippr är byggt för att göra mästerskapen ännu roligare.
                        </p>
                    </div>

                    {/* Founder Section */}
                    <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background border rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <div className="space-y-2">
                                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Grundare & Utvecklare</span>
                                <h2 className="text-3xl font-bold text-foreground">David Perjans</h2>
                            </div>

                            <div className="prose prose-indigo dark:prose-invert">
                                <p className="text-lg leading-relaxed text-muted-foreground">
                                    "Jag gillar fotboll och tycker att marknaden saknar en riktigt bra plattform för att samla kompisar, kollegor och familj för att tävla om vem som faktiskt kan mest om mästerskapen."
                                </p>
                                <p className="text-lg leading-relaxed text-muted-foreground mt-4">
                                    Visionen med Tippr är att skapa den där enkla, snygga och engagerande samlingsplatsen som jag själv alltid saknat. En plats där gemenskapen och tävlingsinstinkten står i centrum.
                                </p>
                            </div>

                            <div className="pt-4">
                                <a
                                    href="https://www.linkedin.com/in/david-perjans-3b6384236/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-5 py-2.5 rounded-full font-medium transition-all transform hover:-translate-y-0.5 shadow-md shadow-blue-900/10"
                                >
                                    <Linkedin className="w-5 h-5" />
                                    Följ mig på LinkedIn
                                </a>
                            </div>
                        </div>

                        {/* Decorative Element */}
                        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                    </div>
                </div>
            </main>
        </div>
    )
}
