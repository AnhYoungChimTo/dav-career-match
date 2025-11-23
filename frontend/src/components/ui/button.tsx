import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stripe-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-r from-stripe-blue to-stripe-blurple text-white hover:shadow-lg hover:-translate-y-0.5 active:scale-95",
                secondary: "bg-white text-stripe-dark border-2 border-gray-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5",
                outline: "border-2 border-stripe-blue text-stripe-blue hover:bg-stripe-blue hover:text-white",
                ghost: "text-stripe-dark hover:bg-gray-100",
                destructive: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5",
                link: "text-stripe-blue underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-3",
                sm: "h-9 px-4 py-2 text-sm",
                lg: "h-13 px-8 py-4 text-lg",
                icon: "h-10 w-10",
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
