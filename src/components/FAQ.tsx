import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type FAQCategory = {
  title: string
  items: {
    question: string
    answer: string
  }[]
}

export function FAQ() {
  const faqData: FAQCategory[] = [
    {
      title: "Generella Frågor",
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
        title: "Grupper",
        items: [
            {
                question: "Hur många kan man vara i en grupp?",
                answer: "Det finns ingen övre gräns! Bjud in hela kontoret, släkten eller kompiskretsen."
            },
            {
                question: "Kan man skapa egna regler?",
                answer: "Ja, som administratör för en liga kan du ställa in vilka regler som ska gälla för just er tävling."
            }
        ]
    }
  ]

  // Track open state as a string combining categoryIndex-itemIndex, e.g. "0-1"
  const [openId, setOpenId] = useState<string | null>("0-0")

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Vanliga frågor</h2>
          <p className="text-muted-foreground">Allt du behöver veta för att komma igång.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto items-start">
          {faqData.map((category, catIndex) => (
            <div key={catIndex} className="bg-card/40 rounded-2xl p-4 border border-border/50">
                <h3 className="text-lg font-bold mb-4 text-primary flex items-center gap-2 px-1">
                    {category.title}
                </h3>
                
                <div className="space-y-3">
                    {category.items.map((item, itemIndex) => {
                        const id = `${catIndex}-${itemIndex}`
                        const isOpen = openId === id

                        return (
                            <div 
                                key={itemIndex} 
                                className={`group border rounded-xl bg-background overflow-hidden transition-all duration-200 hover:shadow-sm cursor-pointer ${isOpen ? 'ring-1 ring-primary/10 border-primary/20' : 'border-border/50 hover:border-primary/20'}`}
                                onClick={() => toggle(id)}
                            >
                                <div className="p-3 flex items-start justify-between gap-3">
                                    <h4 className="font-medium text-foreground text-sm leading-snug pt-0.5 select-none">{item.question}</h4>
                                    {isOpen ? (
                                        <ChevronUp className="w-4 h-4 text-primary shrink-0 transition-transform duration-200" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors duration-200 shrink-0" />
                                    )}
                                </div>
                                
                                <div 
                                    className={`grid transition-all duration-200 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="px-3 pb-3 text-muted-foreground leading-relaxed text-xs border-t border-border/50 pt-2 mx-3 mt-[-2px]">
                                            {item.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
