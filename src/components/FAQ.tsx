import { useState } from 'react'
import { ChevronDown, HelpCircle, MessageCircle, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type FAQCategory = {
  title: string
  icon: React.ElementType
  items: {
    question: string
    answer: string
  }[]
}

export function FAQ() {
  const faqData: FAQCategory[] = [
    {
      title: "Generella Frågor",
      icon: HelpCircle,
      items: [
        {
          question: "Kostar det något att använda Tippr?",
          answer: "Nej, Tippr är 100% gratis för dig och dina vänner. Vi tycker att mästerskap ska vara tillgängliga för alla."
        },
        {
          question: "Fungerar det på mobilen?",
          answer: "Absolut! Tippr är helt responsivt och fungerar lika bra på mobilen som på datorn."
        }
      ]
    },
    {
      title: "Tippning",
      icon: MessageCircle,
      items: [
        {
          question: "Kan man ändra sitt tips?",
          answer: "Ja, du kan ändra ditt tips fram till matchstart. Efter avspark låses tipset automatiskt."
        },
        {
          question: "Hur räknas poängen?",
          answer: "Som standard får du poäng för rätt tecken (1X2) och extra poäng för exakt resultat. Liga-admin kan dock anpassa detta."
        }
      ]
    },
    {
      title: "Ligor",
      icon: Users,
      items: [
        {
          question: "Hur många kan man vara i en liga?",
          answer: "Det finns ingen övre gräns! Bjud in hela kontoret, släkten eller kompiskretsen."
        },
        {
          question: "Kan man skapa egna regler?",
          answer: "Ja, som administratör för en liga kan du ställa in vilka regler som ska gälla för just er tävling."
        }
      ]
    }
  ]

  const [openId, setOpenId] = useState<string | null>("0-0")

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {faqData.map((category, catIndex) => (
        <motion.div
          key={catIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: catIndex * 0.1 }}
          className="bg-bg-surface rounded-2xl border border-border-subtle overflow-hidden"
        >
          {/* Category Header */}
          <div className="bg-gradient-to-r from-brand-500/10 to-brand-600/5 border-b border-border-subtle px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
                <category.icon className="w-4 h-4 text-brand-600" />
              </div>
              <h3 className="font-bold text-text-primary">{category.title}</h3>
            </div>
          </div>

          {/* Questions */}
          <div className="p-3 space-y-2">
            {category.items.map((item, itemIndex) => {
              const id = `${catIndex}-${itemIndex}`
              const isOpen = openId === id

              return (
                <motion.div
                  key={itemIndex}
                  className={`rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${isOpen
                      ? 'bg-brand-50/50 dark:bg-brand-900/20 ring-1 ring-brand-500/20'
                      : 'bg-bg-subtle/50 hover:bg-bg-subtle'
                    }`}
                  onClick={() => toggle(id)}
                  whileHover={{ scale: isOpen ? 1 : 1.01 }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="p-4 flex items-start justify-between gap-3">
                    <h4 className="font-medium text-text-primary text-sm leading-snug select-none">{item.question}</h4>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? 'text-brand-500' : 'text-text-tertiary'}`} />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 text-text-secondary text-sm leading-relaxed border-t border-border-subtle/50 pt-3 mt-1">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
