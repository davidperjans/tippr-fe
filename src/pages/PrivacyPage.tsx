import { ArrowLeft } from 'lucide-react'

export function PrivacyPage() {
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
                <h1 className="text-4xl font-bold mb-4">Integritetspolicy</h1>
                <p className="text-muted-foreground mb-8">Senast uppdaterad: {lastUpdated}</p>

                <div className="space-y-8 prose prose-gray max-w-none">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Inledning</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Vi värnar om din personliga integritet. Denna policy förklarar hur vi samlar in, använder och skyddar dina personuppgifter när du använder tjänsten Tippr.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Vilka uppgifter vi samlar in</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Vi samlar in information som du tillhandahåller oss direkt, exempelvis när du skapar ett konto:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>E-postadress</li>
                            <li>Användarnamn</li>
                            <li>Lösenord (krypterat)</li>
                            <li>Profilbild (om du laddar upp en)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Hur vi använder uppgifterna</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Vi använder dina uppgifter för att:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>Tillhandahålla och administrera Tjänsten.</li>
                            <li>Kommunicera med dig om ditt konto och uppdateringar.</li>
                            <li>Säkerställa säkerheten och förhindra missbruk.</li>
                            <li>Beräkna och visa poängställning i ligor.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Delning av uppgifter</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Vi säljer aldrig dina personuppgifter till tredje part. Vi kan dela information med tjänsteleverantörer som hjälper oss att driva Tjänsten (t.ex. hosting och e-posttjänster), men endast i den utsträckning det krävs.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Dina rättigheter (GDPR)</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Enligt dataskyddsförordningen (GDPR) har du rätt att:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>Begära tillgång till dina personuppgifter.</li>
                            <li>Begära rättelse av felaktiga uppgifter.</li>
                            <li>Begära radering av dina uppgifter ("rätten att bli bortglömd").</li>
                            <li>Invända mot behandling av dina uppgifter.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Vi använder cookies för att hålla dig inloggad och för att förbättra din upplevelse av Tjänsten. Du kan stänga av cookies i din webbläsare, men då kanske inte Tjänsten fungerar som den ska.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Kontakt</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Om du vill utöva dina rättigheter eller har frågor om vår hantering av personuppgifter, kontakta oss.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
