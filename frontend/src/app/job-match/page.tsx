'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { calculateMatch } from '@/lib/matching'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Suspense } from 'react'

function JobMatchContent() {
    const supabase = createClient() as any
    const searchParams = useSearchParams()
    const initialJobId = searchParams.get('id')

    const [loading, setLoading] = useState(true)
    const [matches, setMatches] = useState<any[]>([])
    const [selectedMatch, setSelectedMatch] = useState<any | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // 1. Fetch User Profile & Related Data
            // 1. Fetch User Profile & Related Data
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
            const { data: skills } = await supabase.from('skills').select('*').eq('user_id', user.id)
            const { data: knowledge } = await supabase.from('knowledge_domains').select('*').eq('user_id', user.id)
            const { data: preferences } = await supabase.from('career_preferences').select('*').eq('user_id', user.id).single()
            const { data: personality } = await supabase.from('personality').select('*').eq('user_id', user.id).single()

            if (!profile || !personality) {
                setLoading(false)
                return
            }

            // Explicitly cast or check types if inference fails, but with correct Database type it should work.
            // If personality is 'never', it means the table isn't in the types or the client isn't typed.
            // We verified client.ts is typed. Let's assume the types are correct now.
            const userProfile = {
                mbti: personality.mbti || '',
                disc: personality.disc || '',
                skills: skills || [],
                knowledge_domains: knowledge || [],
                career_preferences: preferences || { interest_domains: [] }
            }

            // 2. Fetch All Jobs
            const { data: jobs } = await supabase.from('jobs').select('*')

            if (jobs) {
                // 3. Calculate Matches
                const calculatedMatches = jobs.map((job: any) => {
                    const { score, reasons, gaps } = calculateMatch(job, userProfile)
                    return {
                        ...job,
                        match_percentage: score,
                        fit_reasons: reasons,
                        skill_gaps: gaps
                    }
                })

                // Sort by match percentage
                calculatedMatches.sort((a: any, b: any) => b.match_percentage - a.match_percentage)
                setMatches(calculatedMatches)

                // 4. Save Top Matches to Supabase (for Dashboard)
                // We'll save the top 5 matches.
                // First, delete existing matches to avoid duplicates (MVP approach)
                await supabase.from('job_matches').delete().eq('user_id', user.id)

                const matchesToSave = calculatedMatches.slice(0, 5).map((m: any) => ({
                    user_id: user.id,
                    job_id: m.id,
                    match_percentage: m.match_percentage,
                    fit_tags: m.fit_reasons.slice(0, 3), // Use first 3 reasons as tags
                    reasons_for_fit: m.fit_reasons,
                    skill_gaps: m.skill_gaps,
                    knowledge_gaps: [] // Not calculated yet
                }))

                await supabase.from('job_matches').insert(matchesToSave)

                // Select initial job if provided
                if (initialJobId) {
                    const found = calculatedMatches.find((m: any) => m.id === initialJobId)
                    if (found) setSelectedMatch(found)
                } else if (calculatedMatches.length > 0) {
                    setSelectedMatch(calculatedMatches[0])
                }
            }

            setLoading(false)
        }

        fetchData()
    }, [supabase, initialJobId])

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">
            {/* Left Column: Ranked Matches */}
            <div className="w-1/3 flex flex-col gap-4">
                <h2 className="text-xl font-bold text-stripe-dark px-1">Your Top Matches</h2>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-stripe-blue" />
                        </div>
                    ) : matches.length > 0 ? (
                        matches.map((match) => (
                            <div
                                key={match.id}
                                onClick={() => setSelectedMatch(match)}
                                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedMatch?.id === match.id
                                    ? 'border-stripe-blue bg-blue-50'
                                    : 'border-gray-200 bg-white'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-gray-900">{match.title}</h3>
                                    <Badge variant={match.match_percentage > 80 ? "default" : "secondary"}>
                                        {match.match_percentage}%
                                    </Badge>
                                </div>
                                <div className="flex gap-2 mt-1 flex-wrap">
                                    {match.fit_reasons.slice(0, 1).map((reason: string, i: number) => (
                                        <span key={i} className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> {reason}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No matches found. Try updating your profile.
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Match Analysis */}
            <div className="w-2/3">
                {selectedMatch ? (
                    <Card className="h-full overflow-y-auto border-none shadow-none bg-transparent">
                        <CardHeader className="px-0 pt-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-3xl text-stripe-dark">{selectedMatch.title}</CardTitle>
                                    <CardDescription className="mt-2 text-lg">
                                        Match Score: <span className="font-bold text-stripe-blue">{selectedMatch.match_percentage}%</span>
                                    </CardDescription>
                                </div>
                                <Link href={`/roadmap?jobId=${selectedMatch.id}`}>
                                    <Button className="shadow-stripe">
                                        View Roadmap <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                            <Progress value={selectedMatch.match_percentage} className="h-3 mt-4" />
                        </CardHeader>

                        <CardContent className="px-0 space-y-8">
                            {/* Why it fits */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <CheckCircle className="text-green-500" /> Why this role fits you
                                </h3>
                                <div className="grid gap-3">
                                    {selectedMatch.fit_reasons.map((reason: string, i: number) => (
                                        <div key={i} className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-800">
                                            {reason}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Gaps */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <XCircle className="text-red-500" /> Skill Gaps to Bridge
                                </h3>
                                {selectedMatch.skill_gaps.length > 0 ? (
                                    <div className="grid gap-3">
                                        {selectedMatch.skill_gaps.map((gap: string, i: number) => (
                                            <div key={i} className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-800 flex justify-between items-center">
                                                <span>{gap}</span>
                                                <Badge variant="outline" className="bg-white text-red-600 border-red-200">Required</Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No major skill gaps found! You are well prepared.</p>
                                )}
                            </div>

                            {/* Job Description Preview */}
                            <div className="bg-white p-6 rounded-xl border border-gray-100">
                                <h3 className="font-semibold mb-3">About the Role</h3>
                                <p className="text-gray-600 leading-relaxed">{selectedMatch.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 text-gray-400">
                        Select a match to view analysis
                    </div>
                )}
            </div>
        </div>
    )
}

export default function JobMatchPage() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <JobMatchContent />
        </Suspense>
    )
}
