import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface StickySaveBarProps {
    hasChanges: boolean
    allGroupsFilled: boolean
    isSaving: boolean
    onSave: () => void
    onRevert: () => void
    onGoToPlayoffs: () => void
    isLocked: boolean
    activeTab: 'groups' | 'playoffs'
}

export function StickySaveBar({
    hasChanges,
    allGroupsFilled,
    isSaving,
    onSave,
    onRevert,
    onGoToPlayoffs,
    isLocked,
    activeTab
}: StickySaveBarProps) {
    // Don't show if locked
    if (isLocked) return null

    // Show only if there are changes OR all groups are filled and we're on groups tab
    const showBar = hasChanges || (allGroupsFilled && activeTab === 'groups')
    if (!showBar) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-4 px-4 md:pb-6"
            >
                <div className="max-w-2xl mx-auto pointer-events-auto">
                    <div className={cn(
                        "bg-bg-surface/95 backdrop-blur-xl border border-border-subtle",
                        "rounded-2xl shadow-2xl shadow-black/10",
                        "p-4 flex flex-col gap-3"
                    )}>
                        {/* Helper text */}
                        <p className="text-xs text-text-tertiary text-center">
                            Du kan alltid ändra dina tippningar tills deadline.
                        </p>

                        {/* Actions */}
                        <div className="flex items-center justify-center gap-3">
                            {hasChanges ? (
                                <>
                                    {/* Revert button */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onRevert}
                                        disabled={isSaving}
                                        className="text-text-secondary hover:text-text-primary"
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Ångra ändringar
                                    </Button>

                                    {/* Save button */}
                                    <Button
                                        onClick={onSave}
                                        disabled={isSaving}
                                        className="bg-brand-500 hover:bg-brand-600 text-white px-6 rounded-xl shadow-lg shadow-brand-500/25"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Sparar...
                                            </>
                                        ) : (
                                            "Färdig?"
                                        )}
                                    </Button>
                                </>
                            ) : allGroupsFilled && activeTab === 'groups' ? (
                                /* Go to playoffs CTA */
                                <Button
                                    onClick={onGoToPlayoffs}
                                    className="bg-brand-500 hover:bg-brand-600 text-white px-6 rounded-xl shadow-lg shadow-brand-500/25"
                                >
                                    Gå till slutspel
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
