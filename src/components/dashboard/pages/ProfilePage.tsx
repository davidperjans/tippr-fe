import { useState, useRef } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { useLeagues } from '../../../hooks/api'
import { api, syncUser } from '@/lib/api'
import { Trophy, User, Settings, Camera, Mail, Calendar, Activity } from 'lucide-react'
import { UserAvatar } from '@/components/UserAvatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'


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
        <div className="space-y-8 pb-10">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Profile Header */}
            <div className="relative group">
                {/* Cover Image */}
                <div className="h-48 md:h-64 w-full rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Profile Info Card (Overlapping) */}
                <div className="relative px-6 -mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-6">
                    {/* Avatar */}
                    <div className="relative">
                        <UserAvatar
                            user={{
                                username: displayName,
                                avatarUrl: avatarUrl,
                                email: email
                            }}
                            className="w-32 h-32 md:w-40 md:h-40 border-4 border-background bg-background shadow-xl"
                            fallbackClassName="text-4xl md:text-5xl font-bold text-white bg-gradient-to-br from-emerald-400 to-cyan-400"
                        />
                        <button
                            onClick={handleCameraClick}
                            disabled={isUploading}
                            className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            title="Byt profilbild"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Text Info */}
                    <div className="flex-1 text-center md:text-left space-y-1 md:mb-4">
                        <h1 className="text-3xl font-bold">{displayName}</h1>
                        <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                            <Mail className="w-4 h-4" /> {email} • <Calendar className="w-4 h-4 ml-1" /> Medlem sedan {joinDate}
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-4 hidden md:block">
                        <Button onClick={() => setActiveTab('settings')} variant="outline" className="gap-2">
                            <Settings className="w-4 h-4" /> Redigera profil
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b">
                <div className="flex justify-center md:justify-start gap-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'overview' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Översikt
                        {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('leagues')}
                        className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'leagues' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Mina Ligor ({leaguesCount})
                        {activeTab === 'leagues' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'settings' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Inställningar
                        {activeTab === 'settings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Stats Cards */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Antal Ligor</CardTitle>
                                <Trophy className="w-4 h-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{leaguesCount}</div>
                                <p className="text-xs text-muted-foreground">Du är med i {leaguesCount} ligor</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Ägda Ligor</CardTitle>
                                <Activity className="w-4 h-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{ownedLeaguesCount}</div>
                                <p className="text-xs text-muted-foreground">Ligor du har skapat</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Tippr ID</CardTitle>
                                <User className="w-4 h-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-mono bg-muted p-1 rounded truncate select-all cursor-pointer" title="Klicka för att kopiera">
                                    {backendUser?.userId || user?.id}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* LEAGUES TAB */}
                {activeTab === 'leagues' && (
                    <div className="grid md:grid-cols-2 gap-4">
                        {leagues?.map((league) => (
                            <Link key={league.id} to={`/leagues/${league.id}`} className="block group">
                                <div className="bg-card border rounded-xl p-5 hover:border-primary/50 transition-all shadow-sm hover:shadow-md h-full flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                                        🏆
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{league.name}</h3>
                                            {(league.isOwner || league.ownerId === user?.id) && <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">ADMIN</span>}
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{league.description || 'Ingen beskrivning'}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {leagues?.length === 0 && (
                            <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                                Du har inte gått med i några ligor än.
                            </div>
                        )}
                    </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <div className="max-w-xl mx-auto md:mx-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profilinställningar</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Visningsnamn</Label>
                                    <Input id="displayName" defaultValue={displayName} placeholder="Ditt namn" />
                                    <p className="text-xs text-muted-foreground">Detta namn visas för andra användare i ligor.</p>
                                </div>

                                <Button disabled className="w-full">Spara ändringar (Kommer snart)</Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

            </div>
        </div>
    )
}
