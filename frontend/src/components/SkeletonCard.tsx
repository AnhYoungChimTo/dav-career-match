import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SkeletonCardProps {
    className?: string
    variant?: 'default' | 'stat' | 'job' | 'skill'
}

export function SkeletonCard({ className, variant = 'default' }: SkeletonCardProps) {
    if (variant === 'stat') {
        return (
            <Card className={className}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-4 bg-gray-200 rounded" />
                </CardHeader>
                <CardContent>
                    <div className="h-8 w-12 bg-gray-300 rounded mb-2" />
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                </CardContent>
            </Card>
        )
    }

    if (variant === 'job') {
        return (
            <div className={cn("p-4 border rounded-lg bg-white", className)}>
                <div className="flex justify-between items-start mb-2">
                    <div className="h-5 w-40 bg-gray-300 rounded" />
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                </div>
                <div className="flex gap-2 mt-3">
                    <div className="h-6 w-24 bg-gray-200 rounded-full" />
                    <div className="h-6 w-32 bg-gray-200 rounded-full" />
                </div>
            </div>
        )
    }

    if (variant === 'skill') {
        return (
            <div className={cn("p-3 border rounded-lg bg-red-50", className)}>
                <div className="flex justify-between items-center">
                    <div className="h-5 w-32 bg-red-200 rounded" />
                    <div className="h-6 w-20 bg-red-100 rounded-full" />
                </div>
            </div>
        )
    }

    return (
        <Card className={className}>
            <CardHeader>
                <div className="h-6 w-48 bg-gray-300 rounded mb-2" />
                <div className="h-4 w-64 bg-gray-200 rounded" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded" />
                    <div className="h-4 w-4/6 bg-gray-200 rounded" />
                </div>
            </CardContent>
        </Card>
    )
}
