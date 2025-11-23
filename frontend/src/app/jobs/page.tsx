'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Search, Filter } from 'lucide-react'

export default function JobsPage() {
    const supabase = createClient() as any
    const [loading, setLoading] = useState(true)
    const [jobs, setJobs] = useState<any[]>([])
    const [selectedJob, setSelectedJob] = useState<any | null>(null)

    // Filters
    const [searchQuery, setSearchQuery] = useState('')
    const [levelFilter, setLevelFilter] = useState('')
    const [domainFilter, setDomainFilter] = useState('')

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true)
            let query = supabase.from('jobs').select('*')

            if (levelFilter) {
                query = query.eq('level', levelFilter)
            }
            if (domainFilter) {
                query = query.eq('domain', domainFilter)
            }
            // Note: Supabase text search is more complex, for now we filter client side or exact match if simple.
            // Let's fetch all and filter client side for search query if dataset is small, 
            // or use ilike for title.
            if (searchQuery) {
                query = query.ilike('title', `%${searchQuery}%`)
            }

            const { data, error } = await query

            if (error) {
                console.error('Error fetching jobs:', error)
            } else {
                setJobs(data || [])
            }
            setLoading(false)
        }

        // Debounce search
        const timer = setTimeout(() => {
            fetchJobs()
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery, levelFilter, domainFilter, supabase])

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">
            {/* Left Column: Job List & Filters */}
            <div className="w-1/3 flex flex-col gap-4">
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search jobs..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                        >
                            <option value="">All Levels</option>
                            <option value="Intern">Intern</option>
                            <option value="Fresher">Fresher</option>
                            <option value="Junior">Junior</option>
                            <option value="Mid-Level">Mid-Level</option>
                            <option value="Senior">Senior</option>
                        </select>
                        <select
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={domainFilter}
                            onChange={(e) => setDomainFilter(e.target.value)}
                        >
                            <option value="">All Domains</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Design">Design</option>
                            <option value="Product">Product</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Data">Data</option>
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-stripe-blue" />
                        </div>
                    ) : jobs.length > 0 ? (
                        jobs.map((job) => (
                            <div
                                key={job.id}
                                onClick={() => setSelectedJob(job)}
                                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedJob?.id === job.id
                                    ? 'border-stripe-blue bg-blue-50'
                                    : 'border-gray-200 bg-white'
                                    }`}
                            >
                                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="secondary" className="text-xs">{job.level}</Badge>
                                    <Badge variant="outline" className="text-xs">{job.domain}</Badge>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No jobs found.
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Job Details */}
            <div className="w-2/3">
                {selectedJob ? (
                    <Card className="h-full overflow-y-auto">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">{selectedJob.title}</CardTitle>
                                    <CardDescription className="mt-1 flex gap-2">
                                        <Badge>{selectedJob.level}</Badge>
                                        <Badge variant="outline">{selectedJob.domain}</Badge>
                                    </CardDescription>
                                </div>
                                {/* Apply Button or similar could go here */}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="font-semibold mb-2">Overview</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    {selectedJob.description || 'No description available.'}
                                </p>
                            </div>

                            {selectedJob.responsibilities && (
                                <div>
                                    <h4 className="font-semibold mb-2">Responsibilities</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                        {selectedJob.responsibilities.map((res: string, i: number) => (
                                            <li key={i}>{res}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {selectedJob.required_skills && (
                                <div>
                                    <h4 className="font-semibold mb-2">Required Skills</h4>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {Object.entries(selectedJob.required_skills).map(([stage, skills]: [string, any]) => (
                                            <div key={stage} className="bg-gray-50 p-3 rounded-lg">
                                                <h5 className="text-sm font-medium mb-2 text-gray-700">{stage}</h5>
                                                <div className="flex flex-wrap gap-1">
                                                    {Array.isArray(skills) && skills.map((skill: string) => (
                                                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedJob.required_knowledge && (
                                <div>
                                    <h4 className="font-semibold mb-2">Knowledge Requirements</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedJob.required_knowledge.map((k: string, i: number) => (
                                            <Badge key={i} variant="outline">{k}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 text-gray-400">
                        Select a job to view details
                    </div>
                )}
            </div>
        </div>
    )
}
