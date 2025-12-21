import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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

function CountdownUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl bg-bg-surface border border-border-subtle shadow-md flex items-center justify-center">
                <motion.span
                    key={value}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary tabular-nums"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {String(value).padStart(2, '0')}
                </motion.span>
            </div>
            <span className="mt-2 text-xs sm:text-sm font-medium text-text-tertiary uppercase tracking-wider">
                {label}
            </span>
        </div>
    )
}

export function PreLaunchPage() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

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
            <header className="border-b border-border-subtle bg-background/80 backdrop-blur-xl sticky top-0 z-50">
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

            {/* Fixed background that covers entire page */}
            <div className="fixed inset-0 -z-10 bg-background overflow-hidden">
                {/* Base gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-200/50 via-transparent to-accent-200/30 dark:from-brand-900/30 dark:via-transparent dark:to-accent-900/20" />

                {/* Animated gradient orbs */}
                <motion.div
                    className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-brand-300/40 dark:bg-brand-500/20 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-accent-300/30 dark:bg-accent-500/15 blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -80, 0],
                        y: [0, 60, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-0 left-1/3 w-[800px] h-[500px] rounded-full bg-brand-400/30 dark:bg-brand-600/15 blur-3xl"
                    animate={{
                        scale: [1, 1.15, 1],
                        x: [0, 50, 0],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Ambient light spots */}
                <motion.div
                    className="absolute top-20 left-1/4 w-32 h-32 rounded-full bg-brand-400/30 dark:bg-brand-400/15 blur-2xl"
                    animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-accent-400/40 dark:bg-accent-400/20 blur-xl"
                    animate={{
                        opacity: [0.4, 0.8, 0.4],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />

                {/* Logo pattern background - rotated */}
                <div
                    className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02]"
                    style={{
                        backgroundImage: 'url(/newLogo.svg)',
                        backgroundSize: '80px 80px',
                        transform: 'rotate(-20deg) scale(1.5)',
                        transformOrigin: 'center center',
                    }}
                />
            </div>

            {/* Main Content */}
            <main className="flex-1 relative z-0">
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48">

                    <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">

                        {/* Headline - SAMMA STIL SOM HOMEPAGE */}
                        <motion.h1
                            className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-text-primary"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Tippa smartare. <br />
                            <span className="text-brand-600 dark:text-brand-400">Tävla tillsammans.</span>
                        </motion.h1>

                        <motion.p
                            className="text-xl text-text-secondary mb-12 leading-relaxed max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Tippr är den moderna plattformen för att tippa mästerskap med vänner, kollegor och familj. <span className="font-semibold text-text-primary">Lanseras inför VM 2026.</span>
                        </motion.p>

                        {/* Countdown */}
                        <motion.div
                            className="mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <p className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-6">
                                VM 2026 startar om
                            </p>
                            <div className="flex justify-center gap-3 sm:gap-4 md:gap-6">
                                <CountdownUnit value={timeLeft.days} label="Dagar" />
                                <CountdownUnit value={timeLeft.hours} label="Timmar" />
                                <CountdownUnit value={timeLeft.minutes} label="Minuter" />
                                <CountdownUnit value={timeLeft.seconds} label="Sekunder" />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-brand-600 dark:text-brand-400 font-bold tracking-wider uppercase text-sm mb-2 block">
                                Vad du kan förvänta dig
                            </span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary">
                                Din nya favoritapp för tippning
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    className="text-center p-6"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                >
                                    <div className="w-14 h-14 rounded-xl bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center mx-auto mb-4">
                                        <feature.icon className="w-7 h-7 text-brand-600 dark:text-brand-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-text-primary mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-text-secondary text-sm">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4 text-center max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/25">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
                                Vi jobbar på något stort
                            </h2>
                            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
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
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 relative">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <img src="/newLogo.svg" alt="Tippr" className="w-8 h-8" />
                        <span className="font-bold text-lg text-text-primary">Tippr</span>
                    </div>
                    <p className="text-sm text-text-tertiary mb-4">
                        Tippr &copy; {new Date().getFullYear()}
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-text-secondary">
                        <Link to="/terms" className="hover:text-brand-600 transition-colors">Villkor</Link>
                        <Link to="/privacy" className="hover:text-brand-600 transition-colors">Integritet</Link>
                        <Link to="/about" className="hover:text-brand-600 transition-colors">Om oss</Link>
                        <Link to="/contact" className="hover:text-brand-600 transition-colors">Kontakta oss</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
