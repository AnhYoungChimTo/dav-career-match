'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/Badge'
import { Loader2, X, Plus } from 'lucide-react'

interface CareerGoalsProps {
    userId: string
    onNext: () => void
    onBack: () => void
}

const CAREER_TARGETS = [
    'Intern', 'Fresher', 'Junior', 'Mid-Level', 'Senior', 'Freelance', 'Founder'
]

const TIME_HORIZONS = [
    '3 months', '6 months', '12 months'
]

export default function CareerGoals({ userId, onNext, onBack }: CareerGoalsProps) {
    const router = useRouter()
    const supabase = createClient() as any
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        career_target: '',
        work_environment: '',
        time_horizon: '3 months' as '3 months' | '6 months' | '12 months'
    })
    const [interests, setInterests] = useState<string[]>([])
    const [newInterest, setNewInterest] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            const { data: preferences } = await supabase
                .from('career_preferences')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (preferences) {
                setFormData({
                    career_target: preferences.career_target || '',
                    work_environment: preferences.work_environment || '',
                    time_horizon: preferences.time_horizon || '3 months'
                })
                setInterests(preferences.interest_domains || [])
            }
        }
        fetchData()
    }, [userId, supabase])

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const addInterest = () => {
        if (newInterest.trim() && !interests.includes(newInterest.trim())) {
            setInterests([...interests, newInterest.trim()])
            setNewInterest('')
        }
    }

    const removeInterest = (index: number) => {
        setInterests(interests.filter((_, i) => i !== index))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            // 1. Save Preferences
            const { data: existing } = await supabase
                .from('career_preferences')
                .select('id')
                .eq('user_id', userId)
                .single()

            const preferenceData = {
                user_id: userId,
                career_target: formData.career_target,
                work_environment: formData.work_environment,
                time_horizon: formData.time_horizon,
                interest_domains: interests
            }

            if (existing) {
                const { error } = await supabase
                    .from('career_preferences')
                    .update(preferenceData)
                    .eq('user_id', userId)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('career_preferences')
                    .insert(preferenceData)
                if (error) throw error
            }

            // 2. Mark Onboarding as Complete
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ onboarding_completed: true })
                .eq('id', userId)

            if (profileError) throw profileError

            // 3. Redirect (handled by parent onNext, which calls router.push('/dashboard'))
            onNext()
        } catch (error) {
            console.error('Error saving career goals:', error)
            alert('Failed to save career goals')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <CardHeader>
                <CardTitle>Career Goals</CardTitle>
                <CardDescription>Where do you want to go?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Career Target</Label>
                    <select
                        className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.career_target}
                        onChange={(e) => handleChange('career_target', e.target.value)}
                    >
                        <option value="" disabled>Select Target</option>
                        {CAREER_TARGETS.map(target => (
                            <option key={target} value={target}>{target}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-4">
                    <Label>Interest Domains</Label>
                    <div className="flex gap-2">
                        <Input
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            placeholder="e.g. Fintech, EdTech, E-commerce"
                            onKeyDown={(e) => e.key === 'Enter' && addInterest()}
                        />
                        <Button type="button" onClick={addInterest} size="icon">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                        {interests.map((interest, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1 px-3">
                                {interest}
                                <button onClick={() => removeInterest(index)} className="ml-1 hover:text-red-500">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Work Environment Preference</Label>
                    <Input
                        value={formData.work_environment}
                        onChange={(e) => handleChange('work_environment', e.target.value)}
                        placeholder="e.g. Startup, Corporate, Remote-first"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Time Horizon</Label>
                    <select
                        className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.time_horizon}
                        onChange={(e) => handleChange('time_horizon', e.target.value)}
                    >
                        {TIME_HORIZONS.map(horizon => (
                            <option key={horizon} value={horizon}>{horizon}</option>
                        ))}
                    </select>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={handleSave} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Finish Setup
                </Button>
            </CardFooter>
        </>
    )
}
