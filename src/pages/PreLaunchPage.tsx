import { useState, useEffect } from 'react'
import { Trophy, Users, Zap, Target, ChartBar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '../components/theme/ThemeProvider'

// World Cup 2026 starts June 11, 2026
const WORLD_CUP_DATE = new Date('2026-06-11T00:00:00')

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
}

function calculateTimeLeft(): TimeLeft {
    const now = new Date()
    const difference = WORLD_CUP_DATE.getTime() - now.getTime()

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    }
}

// Simple countdown unit - NO animations
function CountdownUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl bg-bg-surface/80 backdrop-blur-sm border border-border-subtle shadow-sm flex items-center justify-center">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary tabular-nums">
                    {String(value).padStart(2, '0')}
                </span>
            </div>
            <span className="mt-2 text-xs sm:text-sm font-medium text-text-tertiary uppercase tracking-wider">
                {label}
            </span>
        </div>
    )
}

export function PreLaunchPage() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())
    const [isVisible, setIsVisible] = useState(false)

    // Fade in on mount
    useEffect(() => {
        // Small delay to ensure CSS is ready
        const timer = setTimeout(() => setIsVisible(true), 50)
        return () => clearTimeout(timer)
    }, [])

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const features = [
        {
            icon: Trophy,
            title: 'Skapa ligor',
            description: 'Bjud in vänner, familj eller kollegor till din egen privata tippeliga.',
        },
        {
            icon: Target,
            title: 'Tippa matcher',
            description: 'Förutsäg resultat och klättra på topplistan.',
        },
        {
            icon: ChartBar,
            title: 'Live-tabeller',
            description: 'Följ ställningen i realtid under matcherna.',
        },
        {
            icon: Users,
            title: 'Tävla tillsammans',
            description: 'Chatta och pika dina vänner direkt i appen.',
        },
    ]

    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden">
            {/* Navigation / Header */}
            <header className="border-b border-border-subtle bg-background/90 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/newLogo.svg" alt="Tippr" className="w-9 h-9" />
                        <span className="text-xl font-bold text-text-primary">
                            Tippr
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* 
                OPTIMIZED BACKGROUND
                - Uses CSS animations instead of Framer Motion (GPU accelerated)
                - Reduced blur from blur-3xl to blur-2xl 
                - Fewer animated elements
                - will-change hint for GPU acceleration
            */}
            <div className="fixed inset-0 -z-10 bg-background overflow-hidden">
                {/* Static gradient overlay - no animation needed */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-200/40 via-transparent to-accent-200/20 dark:from-brand-900/20 dark:via-transparent dark:to-accent-900/15" />

                {/* Animated gradient orbs - CSS animations (GPU accelerated) */}
                <div
                    className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-brand-300/30 dark:bg-brand-500/15 blur-2xl animate-float-slow will-change-transform"
                    style={{ animationDelay: '0s' }}
                />
                <div
                    className="absolute top-1/3 -right-20 w-[400px] h-[400px] rounded-full bg-accent-300/25 dark:bg-accent-500/10 blur-2xl animate-float-slow will-change-transform"
                    style={{ animationDelay: '-7s' }}
                />
                <div
                    className="absolute -bottom-20 left-1/4 w-[450px] h-[300px] rounded-full bg-brand-400/20 dark:bg-brand-600/10 blur-2xl animate-float-slow will-change-transform"
                    style={{ animationDelay: '-14s' }}
                />

                {/* Logo pattern - static, no transform animation */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015]"
                    style={{
                        backgroundImage: 'url(/newLogo.svg)',
                        backgroundSize: '80px 80px',
                        transform: 'rotate(-20deg) scale(1.5)',
                    }}
                />
            </div>

            {/* Main Content - CSS fade in instead of Framer Motion */}
            <main className="flex-1 relative z-0">
                {/* Hero Section */}
                <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32">
                    <div
                        className={`container mx-auto px-4 text-center max-w-4xl relative z-10 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                    >
                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-text-primary">
                            Tippa smartare. <br />
                            <span className="text-brand-600 dark:text-brand-400">Tävla tillsammans.</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-text-secondary mb-10 leading-relaxed max-w-2xl mx-auto">
                            Tippr är den moderna plattformen för att tippa mästerskap med vänner, kollegor och familj. <span className="font-semibold text-text-primary">Lanseras inför VM 2026.</span>
                        </p>

                        {/* Countdown */}
                        <div className="mb-10">
                            <p className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-5">
                                VM 2026 startar om
                            </p>
                            <div className="flex justify-center gap-3 sm:gap-4 md:gap-5">
                                <CountdownUnit value={timeLeft.days} label="Dagar" />
                                <CountdownUnit value={timeLeft.hours} label="Timmar" />
                                <CountdownUnit value={timeLeft.minutes} label="Minuter" />
                                <CountdownUnit value={timeLeft.seconds} label="Sekunder" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 relative">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-12">
                            <span className="text-brand-600 dark:text-brand-400 font-bold tracking-wider uppercase text-sm mb-2 block">
                                Vad du kan förvänta dig
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary">
                                Din nya favoritapp för tippning
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
                            {features.map((feature, i) => (
                                <div
                                    key={i}
                                    className="text-center p-4 sm:p-6"
                                >
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-brand-100/80 dark:bg-brand-900/40 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                        <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-brand-600 dark:text-brand-400" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-text-primary mb-1 sm:mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-text-secondary text-xs sm:text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 relative">
                    <div className="container mx-auto px-4 text-center max-w-3xl">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-brand-500/20">
                            <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-3">
                            Vi jobbar på något stort
                        </h2>
                        <p className="text-base sm:text-lg text-text-secondary mb-6 leading-relaxed">
                            Tippr kommer att revolutionera hur du tippar med dina vänner.
                            Håll utkik – vi är snart redo att lansera!
                        </p>
                        <Link
                            to="/about"
                            className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold hover:text-brand-700 dark:hover:text-brand-300 transition-colors group"
                        >
                            Läs mer om oss
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-10 relative">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-5">
                        <img src="/newLogo.svg" alt="Tippr" className="w-8 h-8" />
                        <span className="font-bold text-lg text-text-primary">Tippr</span>
                    </div>
                    <p className="text-sm text-text-tertiary mb-3">
                        Tippr &copy; {new Date().getFullYear()}
                    </p>
                    <div className="flex items-center justify-center gap-5 text-sm text-text-secondary">
                        <Link to="/terms" className="hover:text-brand-600 transition-colors">Villkor</Link>
                        <Link to="/privacy" className="hover:text-brand-600 transition-colors">Integritet</Link>
                        <Link to="/about" className="hover:text-brand-600 transition-colors">Om oss</Link>
                        <Link to="/contact" className="hover:text-brand-600 transition-colors">Kontakt</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
