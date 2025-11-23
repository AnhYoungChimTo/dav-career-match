'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navigation } from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, CheckCircle, Circle, Calendar, ArrowRight, BookOpen } from 'lucide-react'

interface RoadmapTask {
    id: string;
    week: number;
    title: string;
    description: string;
    completed: boolean;
    type: 'skill' | 'project' | 'networking';
}

interface RoadmapMonth {
    month: number;
    title: string;
    focus: string;
    tasks: RoadmapTask[];
}

import { Suspense } from 'react'

function RoadmapContent() {
    const supabase = createClient() as any
    const router = useRouter()
    const searchParams = useSearchParams()
    const jobId = searchParams.get('jobId')

    const [loading, setLoading] = useState(true)
    const [job, setJob] = useState<any>(null)
    const [roadmap, setRoadmap] = useState<RoadmapMonth[]>([])
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const fetchJobAndGenerateRoadmap = async () => {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/auth')
                return
            }

            if (jobId) {
                const { data: jobData } = await supabase.from('jobs').select('*').eq('id', jobId).single()
                if (jobData) {
                    setJob(jobData)
                    // Generate a mock roadmap based on job skills
                    // In a real app, this would be AI-generated or retrieved from a database
                    generateMockRoadmap(jobData)
                }
            } else {
                // If no job selected, maybe redirect to matches or show a generic "Select a Goal" state
                // For now, let's just show a generic roadmap or redirect
                // router.push('/job-match')
            }
            setLoading(false)
        }

        fetchJobAndGenerateRoadmap()
    }, [jobId, router, supabase])

    const generateMockRoadmap = (jobData: any) => {
        // Mock logic to create a 3-month roadmap
        const skills = Object.values(jobData.required_skills || {}).flat() as string[];
        const mainSkill = skills[0] || "Core Skills";
        const secondarySkill = skills[1] || "Advanced Concepts";

        const mockRoadmap: RoadmapMonth[] = [
            {
                month: 1,
                title: "Month 1: Foundations",
                focus: `Mastering ${mainSkill} basics`,
                tasks: [
                    { id: '1-1', week: 1, title: `Intro to ${mainSkill}`, description: "Complete online course module 1-3", completed: true, type: 'skill' },
                    { id: '1-2', week: 2, title: "Practice Project", description: "Build a simple 'Hello World' equivalent", completed: false, type: 'project' },
                    { id: '1-3', week: 3, title: "Networking", description: "Connect with 3 people in this role on LinkedIn", completed: false, type: 'networking' },
                    { id: '1-4', week: 4, title: "Assessment", description: "Take a skill assessment test", completed: false, type: 'skill' },
                ]
            },
            {
                month: 2,
                title: "Month 2: Deep Dive",
                focus: `Applying ${secondarySkill} in context`,
                tasks: [
                    { id: '2-1', week: 5, title: `Advanced ${secondarySkill}`, description: "Read documentation and best practices", completed: false, type: 'skill' },
                    { id: '2-2', week: 6, title: "Portfolio Piece", description: "Start a capstone project", completed: false, type: 'project' },
                    { id: '2-3', week: 7, title: "Code Review", description: "Get feedback on your code", completed: false, type: 'networking' },
                    { id: '2-4', week: 8, title: "Refinement", description: "Refactor project based on feedback", completed: false, type: 'project' },
                ]
            },
            {
                month: 3,
                title: "Month 3: Job Readiness",
                focus: "Interview prep and final polish",
                tasks: [
                    { id: '3-1', week: 9, title: "Mock Interviews", description: "Practice behavioral and technical questions", completed: false, type: 'networking' },
                    { id: '3-2', week: 10, title: "Resume Update", description: "Tailor resume to this specific role", completed: false, type: 'project' },
                    { id: '3-3', week: 11, title: "Apply", description: "Submit applications to 5 target companies", completed: false, type: 'networking' },
                    { id: '3-4', week: 12, title: "Final Review", description: "Review all learned concepts", completed: false, type: 'skill' },
                ]
            }
        ];

        setRoadmap(mockRoadmap);

        // Calculate progress
        const totalTasks = mockRoadmap.reduce((acc, m) => acc + m.tasks.length, 0);
        const completedTasks = mockRoadmap.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0);
        setProgress(Math.round((completedTasks / totalTasks) * 100));
    }

    const toggleTask = (monthIndex: number, taskIndex: number) => {
        const newRoadmap = [...roadmap];
        newRoadmap[monthIndex].tasks[taskIndex].completed = !newRoadmap[monthIndex].tasks[taskIndex].completed;
        setRoadmap(newRoadmap);

        // Recalculate progress
        const totalTasks = newRoadmap.reduce((acc, m) => acc + m.tasks.length, 0);
        const completedTasks = newRoadmap.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0);
        setProgress(Math.round((completedTasks / totalTasks) * 100));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-stripe-blue" />
            </div>
        )
    }

    if (!jobId && !loading) {
        return (
            <div className="min-h-screen bg-stripe-light font-sans text-stripe-dark">
                <Navigation />
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold mb-4">No Roadmap Selected</h1>
                    <p className="text-gray-600 mb-8">Please select a job match to generate your personalized roadmap.</p>
                    <Button onClick={() => router.push('/job-match')} className="shadow-stripe">
                        Go to Job Matches
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-stripe-light font-sans text-stripe-dark">
            <Navigation />

            {/* Header */}
            <div className="bg-white border-b border-gray-200 pt-24 pb-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <span className="uppercase tracking-wider font-semibold text-stripe-blue">Target Role</span>
                                <span>•</span>
                                <span>3 Month Plan</span>
                            </div>
                            <h1 className="text-3xl font-bold text-stripe-dark">{job?.title || "Career Roadmap"}</h1>
                            <p className="text-gray-600 mt-1">Follow this step-by-step plan to land your dream job.</p>
                        </div>
                        <div className="w-full md:w-64">
                            <div className="flex justify-between text-sm mb-2 font-medium">
                                <span>Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-3" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Roadmap Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="space-y-8">
                    {roadmap.map((month, mIndex) => (
                        <Card key={mIndex} className="card-stripe overflow-hidden border-none shadow-sm">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-stripe-dark">{month.title}</h3>
                                    <p className="text-sm text-gray-500">Focus: {month.focus}</p>
                                </div>
                                <Calendar className="text-gray-300 w-6 h-6" />
                            </div>
                            <CardContent className="p-0">
                                <div className="divide-y divide-gray-100">
                                    {month.tasks.map((task, tIndex) => (
                                        <div
                                            key={task.id}
                                            className={`p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${task.completed ? 'bg-blue-50/30' : ''}`}
                                            onClick={() => toggleTask(mIndex, tIndex)}
                                        >
                                            <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-stripe-blue border-stripe-blue text-white' : 'border-gray-300 text-transparent hover:border-stripe-blue'}`}>
                                                <CheckCircle className="w-4 h-4" />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                                        Week {task.week}: {task.title}
                                                    </h4>
                                                    <Badge variant="outline" className="text-xs uppercase tracking-wide text-gray-500 border-gray-200">
                                                        {task.type}
                                                    </Badge>
                                                </div>
                                                <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {task.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-500 mb-4">Completed all tasks?</p>
                    <Button className="shadow-stripe" size="lg">
                        Mark Roadmap as Complete <CheckCircle className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function RoadmapPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <RoadmapContent />
        </Suspense>
    )
}
