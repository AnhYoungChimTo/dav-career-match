'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Briefcase, Target, User as UserIcon, Sparkles } from 'lucide-react'

export default function Sidebar() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    const navLinks = [
        { label: 'Dashboard', href: '/dashboard', icon: Home },
        { label: 'Job Match', href: '/job-match', icon: Target },
        { label: 'Roadmap', href: '/roadmap', icon: Briefcase },
        { label: 'Profile', href: '/profile', icon: UserIcon },
    ]

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 flex flex-col">
            {/* Logo */}
            <Link href="/dashboard" className="mb-8 group">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-stripe-blue to-stripe-blurple rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-stripe-blue to-stripe-blurple bg-clip-text text-transparent">
                            DAV Career
                        </h1>
                        <p className="text-xs text-gray-500 font-medium">Match</p>
                    </div>
                </div>
            </Link>

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
                {navLinks.map((link) => {
                    const Icon = link.icon
                    const active = isActive(link.href)

                    return (
                        <Link key={link.href} href={link.href}>
                            <div className={`
                                group relative flex items-center gap-3 px-4 py-3 rounded-lg 
                                transition-all duration-200 cursor-pointer
                                ${active
                                    ? 'bg-gradient-to-r from-stripe-blue to-stripe-blurple text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }
                            `}>
                                {active && (
                                    <span className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />
                                )}
                                <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className={`font-medium ${active ? 'text-white' : 'group-hover:text-stripe-dark'}`}>
                                    {link.label}
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer / Version Info */}
            <div className="pt-4 mt-auto border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center">
                    Version 1.0.0
                </p>
            </div>
        </aside>
    )
}
