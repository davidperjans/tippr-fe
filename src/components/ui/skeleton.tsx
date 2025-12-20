import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    animate?: boolean
}

function Skeleton({ className, animate = true, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "rounded-xl bg-bg-muted",
                animate && "animate-pulse",
                className
            )}
            {...props}
        />
    )
}

// Premium skeleton with shimmer effect
function SkeletonShimmer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl bg-bg-muted",
                className
            )}
            {...props}
        >
            <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ translateX: ["0%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
        </div>
    )
}

// Card skeleton for dashboard cards
function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn("rounded-2xl border border-border-subtle bg-bg-surface p-5", className)}>
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-12" />
        </div>
    )
}

// Match row skeleton
function SkeletonMatchRow() {
    return (
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
            <Skeleton className="h-9 w-20 rounded-xl" />
        </div>
    )
}

// League item skeleton
function SkeletonLeagueItem() {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl">
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
            <Skeleton className="h-4 w-4 rounded" />
        </div>
    )
}

// Table row skeleton
function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
    return (
        <div className="flex items-center gap-4 p-3 border-b border-border-subtle">
            <Skeleton className="h-6 w-6 rounded-lg" />
            {Array.from({ length: columns - 1 }).map((_, i) => (
                <Skeleton key={i} className={cn("h-4", i === 0 ? "w-32" : "w-12")} />
            ))}
        </div>
    )
}

// Page header skeleton
function SkeletonPageHeader() {
    return (
        <div className="space-y-2 mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
        </div>
    )
}

// Full page loading skeleton
function SkeletonPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <SkeletonPageHeader />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-6 w-40 mb-4" />
                    <div className="rounded-2xl border border-border-subtle overflow-hidden">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <SkeletonMatchRow key={i} />
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <div className="rounded-2xl border border-border-subtle p-4 space-y-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <SkeletonLeagueItem key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export {
    Skeleton,
    SkeletonShimmer,
    SkeletonCard,
    SkeletonMatchRow,
    SkeletonLeagueItem,
    SkeletonTableRow,
    SkeletonPageHeader,
    SkeletonPage
}
