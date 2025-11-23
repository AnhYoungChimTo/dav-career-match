'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ImageUpload } from '@/components/ImageUpload'
import { Loader2 } from 'lucide-react'

interface PersonalBasicsProps {
    userId: string
    onNext: () => void
}

export default function PersonalBasics({ userId, onNext }: PersonalBasicsProps) {
    const supabase = createClient() as any
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        avatar_url: '',
        university: '',
        major: '',
        year_of_study: '',
        email: '' // Read-only
    })

    useEffect(() => {
        const fetchData = async () => {
            // Fetch existing profile data
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            // Fetch email from auth
            const { data: { user } } = await supabase.auth.getUser()

            if (profile) {
                setFormData({
                    full_name: profile.full_name || '',
                    avatar_url: profile.avatar_url || '',
                    university: profile.university || '',
                    major: profile.major || '',
                    year_of_study: profile.year_of_study || '',
                    email: user?.email || ''
                })
            }
        }
        fetchData()
    }, [userId, supabase])

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    full_name: formData.full_name,
                    avatar_url: formData.avatar_url,
                    university: formData.university,
                    major: formData.major,
                    year_of_study: formData.year_of_study,
                    updated_at: new Date().toISOString()
                })
                .select()

            if (error) throw error
            onNext()
        } catch (error) {
            console.error('Error saving profile:', error)
            alert('Failed to save profile')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <CardHeader>
                <CardTitle>Personal Basics</CardTitle>
                <CardDescription>Let's get to know you better.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <ImageUpload
                        value={formData.avatar_url}
                        onChange={(val) => handleChange('avatar_url', val || '')}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                            id="full_name"
                            value={formData.full_name}
                            onChange={(e) => handleChange('full_name', e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={formData.email}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="university">University</Label>
                        <Input
                            id="university"
                            value={formData.university}
                            onChange={(e) => handleChange('university', e.target.value)}
                            placeholder="University Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="major">Major</Label>
                        <Input
                            id="major"
                            value={formData.major}
                            onChange={(e) => handleChange('major', e.target.value)}
                            placeholder="Computer Science"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="year_of_study">Year of Study</Label>
                        <Input
                            id="year_of_study"
                            value={formData.year_of_study}
                            onChange={(e) => handleChange('year_of_study', e.target.value)}
                            placeholder="3rd Year"
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save & Continue
                </Button>
            </CardFooter>
        </>
    )
}
