import { useState } from 'react'
import { ArrowLeft, Mail, MessageSquare, Send, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export function ContactPage() {
    const [email, setEmail] = useState('')
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Construct mailto link
        const subject = encodeURIComponent(`[Kontakt] ${title}`)
        const body = encodeURIComponent(`Från: ${email}\n\n${message}`)
        window.location.href = `mailto:support@tippr.se?subject=${subject}&body=${body}`
    }

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

            <main className="container mx-auto px-4 py-12 flex justify-center">
                <div className="w-full max-w-4xl">
                    <div className="text-center space-y-2 mb-12">
                        <h1 className="text-3xl font-bold tracking-tight">Kontakta oss</h1>
                        <p className="text-muted-foreground">
                            Vi finns här för att hjälpa till.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Form */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">Skicka ett meddelande</h2>
                                <p className="text-sm text-muted-foreground">
                                    Fyll i formuläret nedan så öppnas din mailklient.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Din e-post</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="namn@exempel.se"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Ämne</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="title"
                                            placeholder="Vad gäller ärendet?"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Meddelande</Label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Textarea
                                            id="message"
                                            placeholder="Beskriv ditt ärende här..."
                                            value={message}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                                            required
                                            className="min-h-[150px] pl-10 resize-none"
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full font-semibold h-11 group">
                                    Skicka meddelande
                                    <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>
                        </div>

                        {/* Discord Section */}
                        <div className="space-y-6 lg:border-l lg:pl-12 lg:min-h-[400px]">
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">Community & Support</h2>
                                <p className="text-sm text-muted-foreground">
                                    Snabbast svar får du oftast i vår Discord-kanal.
                                </p>
                            </div>

                            <div className="bg-muted/30 border rounded-2xl p-6 space-y-4">
                                <div className="w-12 h-12 bg-[#5865F2]/10 text-[#5865F2] rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-7 h-7" viewBox="0 0 127.14 96.36">
                                        <path fill="currentColor" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22c.63-15.02-2.34-41.56-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                                    </svg>
                                </div>

                                <h3 className="font-bold text-lg">Gå med i Discord</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Diskutera matcher, kom med feature-förslag eller rapportera problem direkt till utvecklarna.
                                </p>

                                <a
                                    href="https://discord.gg/DS9t93Su24"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2.5 rounded-xl font-semibold transition-colors mt-4"
                                >
                                    Gå med nu
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
