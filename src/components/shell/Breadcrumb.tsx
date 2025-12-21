import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
    label: string
    to?: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
    className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
    if (items.length === 0) return null

    return (
        <nav className={cn("flex items-center gap-1.5 text-sm", className)}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1
                const isFirst = index === 0

                return (
                    <div key={index} className="flex items-center gap-1.5">
                        {/* Separator */}
                        {!isFirst && (
                            <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0" />
                        )}

                        {/* Item */}
                        {isLast || !item.to ? (
                            <span className={cn(
                                "font-medium truncate max-w-[200px]",
                                isLast ? "text-text-primary" : "text-text-tertiary"
                            )}>
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                to={item.to}
                                className="text-text-tertiary hover:text-text-primary transition-colors truncate max-w-[200px]"
                            >
                                {item.label}
                            </Link>
                        )}
                    </div>
                )
            })}
        </nav>
    )
}
