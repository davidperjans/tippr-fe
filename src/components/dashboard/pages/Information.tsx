import { FAQ } from "../../../components/FAQ"
import { motion } from "framer-motion"
import { HelpCircle, BookOpen, Mail, Sparkles, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"

export function Information() {
    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Hero Header */}
            <motion.div
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-8 text-white shadow-xl shadow-brand-500/25"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                        backgroundSize: '20px 20px'
                    }}
                />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-brand-200" />
                        <span className="text-sm font-medium text-brand-200">Hjälpcenter</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Information & FAQ</h1>
                    <p className="text-brand-100 mt-2 max-w-lg">
                        Allt du behöver veta för att komma igång med Tippr.
                    </p>
                </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {[
                    { icon: HelpCircle, title: 'Vanliga Frågor', desc: 'Svar på de vanligaste frågorna', href: '#faq' },
                    { icon: BookOpen, title: 'Om Tippr', desc: 'Läs om vår vision', href: '/about' },
                    { icon: Mail, title: 'Kontakta Oss', desc: 'Vi svarar snabbt!', href: '/contact' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                        <Link to={item.href}>
                            <Card className="h-full border-border-subtle hover:border-brand-300 hover:shadow-lg transition-all group cursor-pointer">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center shrink-0 group-hover:from-brand-500 group-hover:to-brand-600 transition-all">
                                            <item.icon className="w-5 h-5 text-brand-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-text-primary group-hover:text-brand-600 transition-colors flex items-center gap-2">
                                                {item.title}
                                                <ExternalLink className="w-3 h-3 text-text-tertiary group-hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-all" />
                                            </h3>
                                            <p className="text-sm text-text-secondary mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {/* FAQ Section */}
            <motion.div
                id="faq"
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Vanliga Frågor</h2>
                    <p className="text-text-secondary">Hitta snabbt svar på dina frågor</p>
                </div>
                <FAQ />
            </motion.div>

            {/* Help Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card className="border-border-subtle bg-gradient-to-r from-brand-50/50 to-accent-50/30 dark:from-brand-900/20 dark:to-accent-900/10">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/25">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-text-primary mb-1">Hittade du inte svaret?</h3>
                                <p className="text-text-secondary text-sm">
                                    Vi hjälper dig gärna! Skicka ett meddelande så återkommer vi inom 24 timmar.
                                </p>
                            </div>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold text-sm hover:from-brand-400 hover:to-brand-500 transition-all shadow-lg shadow-brand-500/25 shrink-0"
                            >
                                Kontakta oss
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}
