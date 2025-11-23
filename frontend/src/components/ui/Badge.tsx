import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-stripe-blue focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "bg-stripe-blue/10 text-stripe-blue hover:bg-stripe-blue/20",
                secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
                success: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20",
                warning: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
                danger: "bg-red-500/10 text-red-600 hover:bg-red-500/20",
                teal: "bg-teal-500/10 text-teal-600 hover:bg-teal-500/20",
                outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
            },
            size: {
                sm: "px-2 py-0.5 text-xs",
                default: "px-3 py-1 text-xs",
                lg: "px-4 py-1.5 text-sm",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, size, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
