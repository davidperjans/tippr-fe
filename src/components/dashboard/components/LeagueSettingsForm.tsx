
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2, Save, X, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"
import type { LeagueDto, LeagueSettingsDto } from "@/lib/api"
import { useUpdateLeagueSettings } from "@/hooks/api"

interface LeagueSettingsFormProps {
    league: LeagueDto
    canEdit: boolean
}

export function LeagueSettingsForm({ league, canEdit }: LeagueSettingsFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const updateSettings = useUpdateLeagueSettings()

    // Default settings if undefined, though typically should exist if we are here
    const initialSettings: Partial<LeagueSettingsDto> = league.settings || {
        predictionMode: 'PerMatch',
        deadlineMinutes: 60,
        pointsCorrectScore: 5,
        pointsCorrectOutcome: 2,
        pointsCorrectGoals: 1,
        pointsWinner: 10,
        pointsTopScorer: 5,
        pointsRoundOf16Team: 1,
        pointsQuarterFinalTeam: 2,
        pointsSemiFinalTeam: 4,
        pointsFinalTeam: 6,
        allowLateEdits: false
    }

    const [formData, setFormData] = useState<Partial<LeagueSettingsDto>>(initialSettings)

    const handleSave = async () => {
        try {
            await updateSettings.mutateAsync({
                leagueId: league.id,
                settings: formData
            })
            toast.success("Inställningar uppdaterade")
            setIsEditing(false)
        } catch (error) {
            toast.error("Kunde inte spara inställningar")
            console.error(error)
        }
    }

    const handleChange = (field: keyof LeagueSettingsDto, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    if (isEditing) {
        return (
            <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Redigera Inställningar</h3>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={updateSettings.isPending}>
                            <X className="w-4 h-4 mr-2" /> Avbryt
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={updateSettings.isPending}>
                            {updateSettings.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Spara
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-orange-50/30">
                    {/* General */}
                    <div className="space-y-4">
                        <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Allmänt</Label>

                        <div className="grid gap-2">
                            <Label>Tippningstyp</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.predictionMode}
                                onChange={(e) => handleChange('predictionMode', e.target.value)}
                            >
                                <option value="AllAtOnce">Hela turneringen (Tippa allt innan start)</option>
                                <option value="PerMatch">Match för match (Löpande)</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Deadline (minuter innan start)</Label>
                            <Input
                                type="number"
                                value={formData.deadlineMinutes}
                                onChange={(e) => handleChange('deadlineMinutes', parseInt(e.target.value) || 0)}
                            />
                        </div>

                        <div className="flex items-center justify-between border p-3 rounded-md bg-background">
                            <Label>Tillåt sena ändringar?</Label>
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={formData.allowLateEdits}
                                onChange={(e) => handleChange('allowLateEdits', e.target.checked)}
                            />
                        </div>
                    </div>

                    {/* Points */}
                    <div className="space-y-4">
                        <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Poäng - Matcher</Label>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Exakt resultat</Label>
                                <Input
                                    type="number"
                                    value={formData.pointsCorrectScore}
                                    onChange={(e) => handleChange('pointsCorrectScore', parseInt(e.target.value) || 0)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Rätt tecken (1X2)</Label>
                                <Input
                                    type="number"
                                    value={formData.pointsCorrectOutcome}
                                    onChange={(e) => handleChange('pointsCorrectOutcome', parseInt(e.target.value) || 0)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Rätt målskillnad</Label>
                                <Input
                                    type="number"
                                    value={formData.pointsCorrectGoals}
                                    onChange={(e) => handleChange('pointsCorrectGoals', parseInt(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-4 block">Poäng - Bonus</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Vinnare</Label>
                                <Input
                                    type="number"
                                    value={formData.pointsWinner}
                                    onChange={(e) => handleChange('pointsWinner', parseInt(e.target.value) || 0)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Skyttekung</Label>
                                <Input
                                    type="number"
                                    value={formData.pointsTopScorer}
                                    onChange={(e) => handleChange('pointsTopScorer', parseInt(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border rounded-lg bg-emerald-50/30">
                    <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block mb-4">Poäng - Slutspel (Lag som går vidare)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="grid gap-2">
                            <Label>Åttondel</Label>
                            <Input
                                type="number"
                                value={formData.pointsRoundOf16Team}
                                onChange={(e) => handleChange('pointsRoundOf16Team', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Kvart</Label>
                            <Input
                                type="number"
                                value={formData.pointsQuarterFinalTeam}
                                onChange={(e) => handleChange('pointsQuarterFinalTeam', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Semi</Label>
                            <Input
                                type="number"
                                value={formData.pointsSemiFinalTeam}
                                onChange={(e) => handleChange('pointsSemiFinalTeam', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Final</Label>
                            <Input
                                type="number"
                                value={formData.pointsFinalTeam}
                                onChange={(e) => handleChange('pointsFinalTeam', parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Read-only View
    const settings = initialSettings as LeagueSettingsDto

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg hidden md:block">Inställningar</h3>
                {/* Empty header title just for spacing if title hidden, or standard title. Keeping standard. */}
                {canEdit && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="ml-auto">
                        <Edit2 className="w-4 h-4 mr-2" /> Redigera
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Allmänt</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-muted-foreground">Tippningstyp:</span>
                        <span className="font-medium bg-muted px-2 py-0.5 rounded inline-block w-fit">
                            {settings.predictionMode === 'AllAtOnce' ? 'Hela turneringen' : 'Match för match'}
                        </span>

                        <span className="text-muted-foreground">Deadline:</span>
                        <span className="font-medium">{settings.deadlineMinutes} min innan start</span>

                        <span className="text-muted-foreground">Sen ändring:</span>
                        <span className={`font-medium px-2 py-0.5 rounded inline-block w-fit ${settings.allowLateEdits ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {settings.allowLateEdits ? 'Tillåtet' : 'Ej tillåtet'}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Poängsystem</h3>
                    <div className="grid grid-cols-[1fr_auto] gap-2 text-sm">
                        <span className="text-muted-foreground">Exakt resultat:</span>
                        <span className="font-mono font-bold bg-muted/50 px-2 rounded text-right">{settings.pointsCorrectScore}p</span>

                        <span className="text-muted-foreground">Rätt tecken (1X2):</span>
                        <span className="font-mono font-bold bg-muted/50 px-2 rounded text-right">{settings.pointsCorrectOutcome}p</span>

                        <span className="text-muted-foreground">Rätt målskillnad:</span>
                        <span className="font-mono font-bold bg-muted/50 px-2 rounded text-right">{settings.pointsCorrectGoals}p</span>

                        <span className="text-muted-foreground">Vinnare:</span>
                        <span className="font-mono font-bold bg-amber-100 text-amber-800 px-2 rounded text-right">{settings.pointsWinner}p</span>

                        <span className="text-muted-foreground">Skyttekung:</span>
                        <span className="font-mono font-bold bg-amber-100 text-amber-800 px-2 rounded text-right">{settings.pointsTopScorer}p</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Slutspelspoäng</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div className="flex flex-col gap-1 p-3 bg-muted/20 rounded-lg text-center border border-transparent hover:border-border transition-colors">
                        <span className="text-muted-foreground text-xs uppercase">Åttondel</span>
                        <span className="font-bold text-lg text-emerald-600">{settings.pointsRoundOf16Team}p</span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 bg-muted/20 rounded-lg text-center border border-transparent hover:border-border transition-colors">
                        <span className="text-muted-foreground text-xs uppercase">Kvartsfinal</span>
                        <span className="font-bold text-lg text-emerald-600">{settings.pointsQuarterFinalTeam}p</span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 bg-muted/20 rounded-lg text-center border border-transparent hover:border-border transition-colors">
                        <span className="text-muted-foreground text-xs uppercase">Semifinal</span>
                        <span className="font-bold text-lg text-emerald-600">{settings.pointsSemiFinalTeam}p</span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 bg-muted/20 rounded-lg text-center border border-transparent hover:border-border transition-colors">
                        <span className="text-muted-foreground text-xs uppercase">Final</span>
                        <span className="font-bold text-lg text-emerald-600">{settings.pointsFinalTeam}p</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
