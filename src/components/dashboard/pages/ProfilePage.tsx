import { useState, useRef } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { useLeagues } from '../../../hooks/api'
import { api, syncUser } from '@/lib/api'
import { Trophy, Settings, Camera, Mail, Activity, Shield } from 'lucide-react'
import { UserAvatar } from '@/components/UserAvatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

export function ProfilePage() {
    const { user, backendUser, token, setBackendUser } = useAuth()
    const { data: leagues } = useLeagues()
    const [activeTab, setActiveTab] = useState<'overview' | 'leagues' | 'settings'>('overview')
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const displayName = backendUser?.displayName || user?.user_metadata?.displayName || 'Användare'
    const email = user?.email
    const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long' }) : 'N/A'
    const avatarUrl = backendUser?.avatarUrl

    // Stats
    const leaguesCount = leagues?.length || 0
    const ownedLeaguesCount = leagues?.filter(l => l.isOwner || l.ownerId === user?.id).length || 0

    const handleCameraClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !token) return

        try {
            setIsUploading(true)
            await api.users.uploadAvatar(token, file)

            // Refresh user data to get new avatar URL
            const updatedUser = await syncUser(token)

            if (setBackendUser) {
                setBackendUser(updatedUser)
            } else {
                window.location.reload() // Fallback
            }

        } catch (error) {
            console.error('Failed to upload avatar:', error)
            alert('Misslyckades med att ladda upp profilbild.')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Header Area */}
            <div className="relative mb-16">
                {/* Cover */}
                <div className="h-48 md:h-60 w-full rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                </div>

                {/* Avatar & Ident */}
                <div className="absolute -bottom-12 left-6 md:left-10 flex items-end gap-6">
                    <div className="relative group">
                        <div className="p-1.5 bg-bg-app rounded-full">
                            <UserAvatar
                                user={{
                                    username: displayName,
                                    avatarUrl: avatarUrl,
                                    email: email
                                }}
                                className="w-32 h-32 md:w-36 md:h-36 shadow-lg border-2 border-border-subtle"
                                fallbackClassName="text-4xl"
                            />
                        </div>
                        <button
                            onClick={handleCameraClick}
                            disabled={isUploading}
                            className="absolute bottom-2 right-2 p-2 rounded-full bg-brand-500 text-white shadow-lg hover:bg-brand-600 transition-transform hover:scale-110 disabled:opacity-50"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="pb-2 mb-1">
                        <h1 className="text-3xl font-bold text-text-primary tracking-tight">{displayName}</h1>
                        <p className="text-text-secondary flex items-center gap-2 text-sm mt-1">
                            <Mail className="w-3.5 h-3.5" /> {email}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="absolute bottom-4 right-6 hidden md:block">
                    <Button variant="secondary" onClick={() => setActiveTab('settings')} className="shadow-sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Redigera Profil
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <Card className="p-4 flex items-center gap-4 bg-bg-surface border-border-subtle shadow-sm">
                    <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold tabular-nums">{leaguesCount}</div>
                        <div className="text-xs text-text-tertiary font-medium uppercase tracking-wider">Ligor</div>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-bg-surface border-border-subtle shadow-sm">
                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold tabular-nums">{ownedLeaguesCount}</div>
                        <div className="text-xs text-text-tertiary font-medium uppercase tracking-wider">Ägda</div>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-bg-surface border-border-subtle shadow-sm col-span-2 md:col-span-2">
                    <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-text-tertiary font-medium uppercase tracking-wider mb-0.5">Medlemskap</div>
                        <div className="text-sm font-medium text-text-primary">Gick med {joinDate}</div>
                    </div>
                </Card>
            </div>

            {/* Navigation Tabs (Inline) */}
            <div className="border-b border-border-subtle flex gap-6 mt-8">
                {['Overview', 'Leagues', 'Settings'].map((tab) => {
                    const key = tab.toLowerCase() as typeof activeTab
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors px-1 ${activeTab === key
                                ? 'border-brand-500 text-brand-600'
                                : 'border-transparent text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            {tab === 'Overview' ? 'Översikt' : tab === 'Leagues' ? 'Mina Ligor' : 'Inställningar'}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
                {activeTab === 'overview' && (
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Senaste Aktivitet</CardTitle>
                                <CardDescription>Vad som hänt nyligen (Kommer snart).</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12 text-text-tertiary border-2 border-dashed border-border-subtle rounded-xl">
                                    Ingen aktivitet att visa än.
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'leagues' && (
                    <div className="grid md:grid-cols-2 gap-4">
                        {leagues?.map((league) => (
                            <Link key={league.id} to={`/leagues/${league.id}`} className="group block">
                                <div className="flex items-center gap-4 p-4 rounded-xl border border-border-subtle bg-bg-surface hover:border-brand-300 hover:shadow-md transition-all">
                                    <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 text-lg font-bold border border-brand-100">
                                        {(league.name || '?')[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-text-primary group-hover:text-brand-700 truncate">{league.name}</h4>
                                            {(league.isOwner || league.ownerId === user?.id) && <Badge variant="secondary" className="text-[10px]">Ägare</Badge>}
                                        </div>
                                        <p className="text-sm text-text-tertiary truncate">{league.description || 'Ingen beskrivning'}</p>
                                    </div>
                                    <div className="text-text-tertiary">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-2xl">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profilinställningar</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Visningsnamn</Label>
                                    <Input defaultValue={displayName} placeholder="Ange ditt namn" />
                                    <p className="text-xs text-text-tertiary">Det namn som visas i topplistor och ligor.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>E-post</Label>
                                    <Input defaultValue={email || ''} disabled className="bg-bg-subtle" />
                                    <p className="text-xs text-text-tertiary">E-postadress kan inte ändras.</p>
                                </div>
                                <div className="pt-4">
                                    <Button className="w-full sm:w-auto">Spara Ändringar</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
