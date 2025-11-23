'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { JOBS_DATA } from '@/lib/data/jobs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react'

export default function SeedPage() {
    const supabase = createClient() as any
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    const seedJobs = async () => {
        setLoading(true)
        setStatus('Starting seed process...')
        setError(null)

        try {
            // 1. Check if jobs already exist (optional: delete all?)
            // For safety, let's just insert and ignore duplicates if we had a unique constraint,
            // but we don't have a unique constraint on title/slug in the schema shown.
            // So we might duplicate data if run twice.
            // Let's delete all first for a clean slate (DANGEROUS in prod, fine for dev)
            setStatus('Clearing existing jobs...')
            const { error: deleteError } = await supabase.from('jobs').delete().neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

            if (deleteError) throw deleteError

            setStatus(`Inserting ${JOBS_DATA.length} jobs...`)

            const jobsToInsert = JOBS_DATA.map(job => ({
                title: job.title,
                description: job.shortDescription + '\n\n' + job.notes,
                responsibilities: job.responsibilities,
                required_skills: job.hardSkills, // Mapping hardSkills to required_skills array
                required_knowledge: [], // No direct mapping in data, leaving empty
                domain: job.domain,
                level: 'Entry', // Defaulting to Entry level for now
                // We could store other fields in a metadata column if we had one, but we don't.
            }))

            const { error: insertError } = await supabase.from('jobs').insert(jobsToInsert)

            if (insertError) throw insertError

            setStatus('Seeding completed successfully!')
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'An error occurred during seeding')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Database Seeder</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-500">
                        This tool will wipe the <strong>jobs</strong> table and repopulate it with {JOBS_DATA.length} entries from the source data.
                    </p>

                    {status && (
                        <div className={`p-3 rounded-md text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {error ? <AlertTriangle className="w-4 h-4 inline mr-2" /> : <CheckCircle className="w-4 h-4 inline mr-2" />}
                            {error || status}
                        </div>
                    )}

                    <Button
                        onClick={seedJobs}
                        disabled={loading}
                        className="w-full"
                        variant={error ? "destructive" : "default"}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {loading ? 'Seeding...' : 'Seed Jobs Data'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
