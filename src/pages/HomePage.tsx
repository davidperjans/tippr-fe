import { TournamentMarquee } from '../components/TournamentMarquee'
import { MockLeaderboard } from '../components/MockLeaderboard'
import { BentoFeatures } from '../components/BentoFeatures'
import { Timeline } from '../components/Timeline'
import { FAQ } from '../components/FAQ'
import { CallToAction } from '../components/CallToAction'
import { ArrowRight, Sparkles, Target, Users, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '../components/theme/ThemeProvider'
import { motion } from 'framer-motion'

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-background">
      {/* Navigation / Header */}
      <header className="border-b border-border-subtle bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">
              Tippr
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Logga in
            </Link>
            <Link to="/signup" className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-brand-400 hover:to-brand-500 transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5">
              Kom igång
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section - Custom Gradient Background */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 -z-10">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-background to-background dark:from-brand-950/30" />

            {/* Decorative blobs */}
            <motion.div
              className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-200/30 dark:bg-brand-500/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-accent-400/20 dark:bg-accent-500/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-100/40 dark:bg-brand-600/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Grid pattern - Premium dots */}
            <div
              className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }}
            />
          </div>

          <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
            {/* Badge */}
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 text-sm font-semibold mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              Lanseras inför Fotbolls-VM 2026
            </motion.span>

            {/* Headline */}
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
              Släng Excel-arket i papperskorgen. Tippr är den moderna plattformen för att tippa mästerskap med vänner, kollegor och familj. <span className="font-semibold text-text-primary">Helt gratis.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-2xl font-semibold text-lg hover:from-brand-400 hover:to-brand-500 transition-all shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                Skapa en liga
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-bg-surface border-2 border-border-subtle text-text-primary rounded-2xl font-semibold text-lg hover:border-brand-500 hover:text-brand-600 transition-all hover:-translate-y-1"
              >
                Hur funkar det?
              </a>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {[
                { value: '10K+', label: 'Användare' },
                { value: '500+', label: 'Ligor' },
                { value: '100K+', label: 'Predictions' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                >
                  <div className="text-2xl lg:text-3xl font-bold text-text-primary">{stat.value}</div>
                  <div className="text-sm text-text-tertiary">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Marquee Section */}
        <TournamentMarquee />

        {/* Leaderboard Split Section */}
        <section className="py-24 bg-background relative overflow-hidden">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              {/* Visual (Left) */}
              <motion.div
                className="w-full lg:w-1/2 relative"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-accent-500/20 blur-3xl rounded-full opacity-50" />
                <MockLeaderboard />
              </motion.div>

              {/* Content (Right) */}
              <motion.div
                className="w-full lg:w-1/2 text-left"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-brand-600 dark:text-brand-400 font-bold tracking-wider uppercase text-sm mb-2 block">Tävla mot vännerna</span>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-text-primary leading-tight">
                  Vem är egentligen fotbollsexperten?
                </h2>
                <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                  Starta en privat liga på sekunder och bjud in familjen, polarna eller varför inte kollegorna? Vi sköter all administration, rättning och tabeller automatiskt.
                </p>

                <ul className="space-y-4 mb-8">
                  {[
                    { icon: Zap, text: 'Live-uppdaterade tabeller i realtid' },
                    { icon: Target, text: 'Smarta notiser vid mål och resultatskiften' },
                    { icon: Users, text: 'Chatt och pikar direkt i ligan' },
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center gap-3 text-text-primary font-medium"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      {item.text}
                    </motion.li>
                  ))}
                </ul>

                <Link to="/signup" className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold hover:text-brand-700 dark:hover:text-brand-300 transition-colors group">
                  Starta din liga nu
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <BentoFeatures />

        {/* How it works Timeline */}
        <Timeline />

        {/* FAQ Section */}
        <FAQ />

        {/* Call To Action */}
        <CallToAction />

      </main>

      {/* Footer */}
      <footer className="py-12 bg-bg-surface border-t border-border-subtle">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
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
