'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/Badge'
import { SkeletonCard } from '@/components/SkeletonCard'
import Link from 'next/link'
import { Loader2, ArrowRight, Briefcase, AlertTriangle, TrendingUp, Target, Sparkles } from 'lucide-react'

export default function DashboardPage() {
    const supabase = createClient() as any
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<any>(null)
    const [topMatches, setTopMatches] = useState<any[]>([])
    const [skillGaps, setSkillGaps] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // 1. Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            setProfile(profileData)

            // 2. Fetch Top Matches
            const { data: matchesData } = await supabase
                .from('job_matches')
                .select('*, jobs(*)')
                .eq('user_id', user.id)
                .order('match_percentage', { ascending: false })
                .limit(3)

            setTopMatches(matchesData || [])

            // 3. Fetch Skill Gaps
            if (matchesData && matchesData.length > 0) {
                const topMatch = matchesData[0]
                const gaps = topMatch.skill_gaps
                if (gaps) {
                    let flatGaps: string[] = []
                    if (Array.isArray(gaps)) {
                        flatGaps = gaps
                    } else if (typeof gaps === 'object') {
                        Object.values(gaps).forEach((val: any) => {
                            if (Array.isArray(val)) flatGaps.push(...val)
                        })
                    }
                    setSkillGaps(flatGaps.slice(0, 3))
                }
            }

            setLoading(false)
        }
        fetchData()
    }, [supabase])

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 18) return 'Good afternoon'
        return 'Good evening'
    }

    // Loading state with skeleton screens
    if (loading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Greeting & Stats Skeletons */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="col-span-2 bg-gradient-to-r from-gray-200 to-gray-300 border-none h-40" />
                    <SkeletonCard variant="stat" />
                    <SkeletonCard variant="stat" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <div className="h-6 w-40 bg-gray-300 rounded mb-2" />
                            <div className="h-4 w-56 bg-gray-200 rounded" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <SkeletonCard variant="job" />
                            <SkeletonCard variant="job" />
                            <SkeletonCard variant="job" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="h-6 w-40 bg-gray-300 rounded mb-2" />
                            <div className="h-4 w-56 bg-gray-200 rounded" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <SkeletonCard variant="skill" />
                            <SkeletonCard variant="skill" />
                            <SkeletonCard variant="skill" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    // Calculate completion %
    const completionPercentage = profile?.onboarding_completed ? 100 : 25

    // Get match score color
    const getMatchColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200'
        if (percentage >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
        return 'text-orange-600 bg-orange-50 border-orange-200'
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Greeting & Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Enhanced Welcome Card with Static Gradient */}
                <Card className="col-span-2 bg-gradient-to-r from-stripe-blue to-stripe-blurple text-white border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <CardHeader className="relative z-10">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            <CardTitle className="text-white text-2xl">
                                {getGreeting()}, {profile?.full_name?.split(' ')[0] || 'User'}!
                            </CardTitle>
                        </div>
                        <CardDescription className="text-blue-100 text-base">
                            You're on track to finding your dream career
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Profile Completion</span>
                                <span>{completionPercentage}%</span>
                            </div>
                            <Progress value={completionPercentage} className="h-2 bg-white/20" />
                        </div>
                    </CardContent>
                </Card>

                {/* Enhanced Stat Cards */}
                <Card className="hover-lift shadow-stripe border-l-4 border-l-stripe-blue">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Job Matches</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-stripe-blue to-stripe-blurple flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-stripe-dark">{topMatches.length}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Roles matching your profile
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover-lift shadow-stripe border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Skill Gaps</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-stripe-dark">{skillGaps.length}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            Skills to acquire for top role
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Top Job Matches - Enhanced */}
                <Card className="col-span-1 shadow-stripe-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-stripe-blue" />
                            Top Job Matches
                        </CardTitle>
                        <CardDescription>Based on your skills and personality</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {topMatches.length > 0 ? (
                            <div className="space-y-3">
                                {topMatches.map((match, index) => (
                                    <div
                                        key={match.id}
                                        className="group p-4 border-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer animate-in slide-in-from-left"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 group-hover:text-stripe-blue transition-colors">
                                                    {match.jobs?.title || 'Unknown Job'}
                                                </h4>
                                            </div>
                                            <Link href={`/job-match?id=${match.id}`} className="ml-2">
                                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            <Badge
                                                variant="outline"
                                                className={`font-semibold ${getMatchColor(match.match_percentage)}`}
                                            >
                                                {match.match_percentage}% Match
                                            </Badge>
                                            {match.fit_tags?.slice(0, 2).map((tag: string) => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <Link href="/job-match" className="block">
                                    <Button variant="outline" className="w-full mt-2 hover:bg-stripe-blue hover:text-white transition-colors">
                                        View All Matches <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-12 px-4">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Briefcase className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-gray-600 font-medium mb-1">No matches found yet</p>
                                <p className="text-sm text-gray-500 mb-4">Complete your profile to get matched</p>
                                <Link href="/profile">
                                    <Button variant="outline">Update Profile</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Skill Gaps - Enhanced */}
                <Card className="col-span-1 shadow-stripe-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Top Skill Gaps
                        </CardTitle>
                        <CardDescription>Focus on these to improve your match score</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {skillGaps.length > 0 ? (
                            <div className="space-y-3">
                                {skillGaps.map((gap, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 text-red-700 rounded-lg border-2 border-red-100 hover:border-red-300 transition-all duration-300 hover:shadow-md animate-in slide-in-from-right"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500" />
                                            <span className="font-medium">{gap}</span>
                                        </div>
                                        <Badge variant="outline" className="bg-white text-red-600 border-red-300 font-semibold">
                                            Required
                                        </Badge>
                                    </div>
                                ))}
                                <Link href="/roadmap" className="block">
                                    <Button className="w-full mt-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-md">
                                        View Learning Roadmap <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-12 px-4">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                                    <Target className="h-8 w-8 text-green-600" />
                                </div>
                                <p className="text-gray-600 font-medium mb-1">No critical skill gaps found!</p>
                                <p className="text-sm text-gray-500">You are well prepared for your top matches</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
