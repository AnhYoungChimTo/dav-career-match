'use client'

import Sidebar from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut, User } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const supabase = createClient() as any
    const [loading, setLoading] = useState(false)
    const [userName, setUserName] = useState<string>('')

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', user.id)
                    .single()

                if (profile) {
                    setUserName(profile.full_name?.split(' ')[0] || 'User')
                }
            }
        }
        fetchProfile()
    }, [supabase])

    const handleLogout = async () => {
        setLoading(true)
        await supabase.auth.signOut()
        router.push('/auth?mode=login')
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                {/* Enhanced Header */}
                <header className="glass sticky top-0 z-40 px-8 py-5 flex justify-between items-center shadow-sm">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-stripe-blue to-stripe-blurple bg-clip-text text-transparent">
                            Dashboard
                        </h2>
                        <p className="text-sm text-gray-600 mt-0.5">
                            Welcome back, {userName}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            disabled={loading}
                            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </>
                            )}
                        </Button>
                    </div>
                </header>
                <main className="flex-1 p-8 overflow-auto scrollbar-thin">
                    {children}
                </main>
            </div>
        </div>
    )
}
