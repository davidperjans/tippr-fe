import { FAQ } from "../../../components/FAQ"

export function Information() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Information & FAQ</h2>
                <p className="text-muted-foreground">Här hittar du svar på vanliga frågor om Tippr.</p>
            </div>

            <div>
                <FAQ />
            </div>
        </div>
    )
}
