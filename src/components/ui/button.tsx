import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/30 hover:from-brand-400 hover:to-brand-500",
        destructive:
          "bg-gradient-to-r from-danger to-danger/90 text-white shadow-md shadow-danger/25 hover:shadow-lg hover:shadow-danger/30",
        outline:
          "border-2 border-border-default bg-transparent text-text-primary hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50",
        secondary:
          "bg-bg-subtle text-text-primary border border-border-subtle hover:bg-bg-muted hover:border-border-default",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-subtle",
        link: "text-brand-500 underline-offset-4 hover:underline hover:text-brand-600",
        premium: "bg-gradient-to-r from-brand-500 via-brand-400 to-accent-500 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 border border-white/10",
        success: "bg-gradient-to-r from-success to-success/90 text-white shadow-md shadow-success/25 hover:shadow-lg hover:shadow-success/30",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
