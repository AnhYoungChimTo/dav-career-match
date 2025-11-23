'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface PersonalityProps {
    userId: string
    onNext: () => void
    onBack: () => void
}

const MBTI_TYPES = [
    'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
    'ISTP', 'ISFP', 'INFP', 'INTP',
    'ESTP', 'ESFP', 'ENFP', 'ENTP',
    'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
]

const DISC_TYPES = [
    'Dominance (D)', 'Influence (I)', 'Steadiness (S)', 'Conscientiousness (C)'
]

export default function Personality({ userId, onNext, onBack }: PersonalityProps) {
    const supabase = createClient() as any
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        mbti: '',
        disc: '',
        working_style: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            const { data: personality } = await supabase
                .from('personality')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (personality) {
                setFormData({
                    mbti: personality.mbti || '',
                    disc: personality.disc || '',
                    working_style: personality.working_style || ''
                })
            }
        }
        fetchData()
    }, [userId, supabase])

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const [error, setError] = useState<string | null>(null)

    const handleSave = async () => {
        setLoading(true)
        setError(null)
        try {
            // Check if exists
            const { data: existing } = await supabase
                .from('personality')
                .select('id')
                .eq('user_id', userId)
                .single()

            if (existing) {
                const { error: updateError } = await supabase
                    .from('personality')
                    .update({
                        mbti: formData.mbti,
                        disc: formData.disc,
                        working_style: formData.working_style
                    })
                    .eq('user_id', userId)
                if (updateError) throw updateError
            } else {
                const { error: insertError } = await supabase
                    .from('personality')
                    .insert({
                        user_id: userId,
                        mbti: formData.mbti,
                        disc: formData.disc,
                        working_style: formData.working_style
                    })
                if (insertError) throw insertError
            }

            onNext()
        } catch (err: any) {
            console.error('Error saving personality:', err)
            setError(err.message || 'Failed to save personality')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <CardHeader>
                <CardTitle>Personality & Style</CardTitle>
                <CardDescription>How do you work best?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                        {error}
                    </div>
                )}
                <div className="space-y-2">
                    <Label>MBTI Type</Label>
                    <select
                        className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.mbti}
                        onChange={(e) => handleChange('mbti', e.target.value)}
                    >
                        <option value="" disabled>Select MBTI Type</option>
                        {MBTI_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>DISC Profile</Label>
                    <select
                        className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.disc}
                        onChange={(e) => handleChange('disc', e.target.value)}
                    >
                        <option value="" disabled>Select DISC Profile</option>
                        {DISC_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>Working Style Preference</Label>
                    <Input
                        value={formData.working_style}
                        onChange={(e) => handleChange('working_style', e.target.value)}
                        placeholder="e.g. Collaborative, Independent, Fast-paced"
                    />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={handleSave} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save & Continue
                </Button>
            </CardFooter>
        </>
    )
}
