import { Sparkles, Trophy, Target, Users } from 'lucide-react'
import { motion } from 'framer-motion'

interface AuthLayoutProps {
    children: React.ReactNode
    mode: 'login' | 'register'
}

const brandingContent = {
    login: {
        title: 'Tippr',
        subtitle: 'Välkommen till framtidens betting-plattform. Tävla med vänner, följ dina ligor och ha kul!',
        stats: [
            { value: '10K+', label: 'Användare' },
            { value: '500+', label: 'Ligor' },
            { value: '99%', label: 'Nöjda' },
        ],
    },
    register: {
        title: 'Gå med i Tippr',
        subtitle: 'Skapa ett gratis konto och börja tävla mot dina vänner redan idag.',
        features: [
            { icon: Trophy, title: 'Tävla i ligor', desc: 'Skapa eller gå med i ligor med vänner' },
            { icon: Target, title: 'Tippa matcher', desc: 'Gissa resultat och tjäna poäng' },
            { icon: Users, title: 'Följ standings', desc: 'Se hur du står dig mot andra' },
        ],
    },
}

export function AuthLayout({ children, mode }: AuthLayoutProps) {
    const isLogin = mode === 'login'

    return (
        <div className="min-h-screen flex overflow-hidden bg-background">
            {/* Form Side */}
            <motion.div
                key={`form-${mode}`}
                initial={{ x: isLogin ? -100 : 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isLogin ? 100 : -100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex-1 flex items-center justify-center p-8"
                style={{ order: isLogin ? 1 : 2 }}
            >
                {children}
            </motion.div>

            {/* Branding Side */}
            <motion.div
                key={`brand-${mode}`}
                initial={{ x: isLogin ? 100 : -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isLogin ? -100 : 100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="hidden lg:flex flex-1 relative overflow-hidden"
                style={{ order: isLogin ? 2 : 1 }}
            >
                {/* Gradient Background */}
                <div className={`absolute inset-0 ${isLogin
                    ? 'bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700'
                    : 'bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500'
                    }`} />

                {/* Decorative Elements */}
                <motion.div
                    className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 w-72 h-72 bg-brand-400/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -5, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"
                    animate={{
                        scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
                    <motion.div
                        className="text-center max-w-md"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {isLogin ? (
                            <>
                                <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-4xl font-bold tracking-tight mb-4">
                                    {brandingContent.login.title}
                                </h2>
                                <p className="text-lg text-brand-100 leading-relaxed">
                                    {brandingContent.login.subtitle}
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-6 mt-12">
                                    {brandingContent.login.stats.map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            className="text-center"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 + i * 0.1 }}
                                        >
                                            <div className="text-3xl font-bold">{stat.value}</div>
                                            <div className="text-sm text-brand-200">{stat.label}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-4xl font-bold tracking-tight mb-4">
                                    {brandingContent.register.title}
                                </h2>
                                <p className="text-lg text-brand-100 leading-relaxed mb-12">
                                    {brandingContent.register.subtitle}
                                </p>

                                {/* Features */}
                                <div className="space-y-6 text-left">
                                    {brandingContent.register.features.map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex items-start gap-4"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 + i * 0.1 }}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                                                <feature.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">{feature.title}</div>
                                                <div className="text-sm text-brand-200">{feature.desc}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
