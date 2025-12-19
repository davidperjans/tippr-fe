import { ArrowLeft } from 'lucide-react'

export function TermsPage() {
    const lastUpdated = new Date().toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

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

            <main className="container mx-auto px-4 py-12 max-w-3xl">
                <h1 className="text-4xl font-bold mb-4">Användarvillkor</h1>
                <p className="text-muted-foreground mb-8">Senast uppdaterad: {lastUpdated}</p>

                <div className="space-y-8 prose prose-gray max-w-none">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Allmänt</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Dessa användarvillkor ("Villkoren") gäller för din användning av tjänsten Tippr ("Tjänsten").
                            Genom att skapa ett konto eller använda Tjänsten godkänner du dessa Villkor i sin helhet.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Tjänstens beskrivning</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Tippr är en plattform för att skapa och delta i tippligor för sportevenemang. Tjänsten tillhandahålls "i befintligt skick"
                            och vi garanterar inte att den alltid är tillgänglig eller felfri.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Användarkonto</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            För att använda vissa delar av Tjänsten måste du skapa ett konto. Du ansvarar för att hålla dina inloggningsuppgifter
                            hemliga och för all aktivitet som sker på ditt konto. Du måste vara minst 18 år för att använda Tjänsten.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Användning av Tjänsten</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Du får inte använda Tjänsten för olagliga ändamål eller på ett sätt som kan skada Tjänsten eller andra användare.
                            Vi förbehåller oss rätten att stänga av användare som bryter mot dessa Villkor.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Immateriella rättigheter</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Allt innehåll i Tjänsten (exklusive användargenererat innehåll) ägs av oss eller våra licensgivare och skyddas av upphovsrättslagen.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Personuppgifter</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Vi hanterar dina personuppgifter i enlighet med vår <a href="/privacy" className="text-primary hover:underline">Integritetspolicy</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Ändringar av Villkoren</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Vi kan komma att ändra dessa Villkor från tid till annan. Om ändringarna är väsentliga kommer vi att meddela dig via e-post
                            eller genom Tjänsten. Fortsatt användning av Tjänsten efter sådana ändringar innebär att du godkänner de nya Villkoren.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Kontakt</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Om du har frågor om dessa Villkor, vänligen kontakta oss.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
