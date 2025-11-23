'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/Badge'
import { Loader2, X, Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SkillsKnowledgeProps {
    userId: string
    onNext: () => void
    onBack: () => void
}

interface Skill {
    id?: string
    skill_name: string
    level: 'Beginner' | 'Intermediate' | 'Advanced'
}

interface Domain {
    id?: string
    domain: string
}

export default function SkillsKnowledge({ userId, onNext, onBack }: SkillsKnowledgeProps) {
    const supabase = createClient() as any
    const [loading, setLoading] = useState(false)
    const [skills, setSkills] = useState<Skill[]>([])
    const [domains, setDomains] = useState<Domain[]>([])

    const [newSkill, setNewSkill] = useState('')
    const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
    const [newDomain, setNewDomain] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            const { data: skillsData } = await supabase
                .from('skills')
                .select('*')
                .eq('user_id', userId)

            const { data: domainsData } = await supabase
                .from('knowledge_domains')
                .select('*')
                .eq('user_id', userId)

            if (skillsData) setSkills(skillsData)
            if (domainsData) setDomains(domainsData)
        }
        fetchData()
    }, [userId, supabase])

    const addSkill = () => {
        if (newSkill.trim()) {
            setSkills([...skills, { skill_name: newSkill.trim(), level: newSkillLevel }])
            setNewSkill('')
            setNewSkillLevel('Beginner')
        }
    }

    const removeSkill = (index: number) => {
        setSkills(skills.filter((_, i) => i !== index))
    }

    const addDomain = () => {
        if (newDomain.trim()) {
            setDomains([...domains, { domain: newDomain.trim() }])
            setNewDomain('')
        }
    }

    const removeDomain = (index: number) => {
        setDomains(domains.filter((_, i) => i !== index))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            // Delete existing (simplest way to handle updates for lists without complex diffing)
            // In a real app, we might want to diff, but for MVP this ensures consistency.
            await supabase.from('skills').delete().eq('user_id', userId)
            await supabase.from('knowledge_domains').delete().eq('user_id', userId)

            // Insert new
            if (skills.length > 0) {
                const { error: skillError } = await supabase.from('skills').insert(
                    skills.map(s => ({
                        user_id: userId,
                        skill_name: s.skill_name,
                        level: s.level
                    }))
                )
                if (skillError) throw skillError
            }

            if (domains.length > 0) {
                const { error: domainError } = await supabase.from('knowledge_domains').insert(
                    domains.map(d => ({
                        user_id: userId,
                        domain: d.domain
                    }))
                )
                if (domainError) throw domainError
            }

            onNext()
        } catch (error) {
            console.error('Error saving skills:', error)
            alert('Failed to save skills')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <CardHeader>
                <CardTitle>Skills & Knowledge</CardTitle>
                <CardDescription>What do you bring to the table?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Skills Section */}
                <div className="space-y-4">
                    <Label>Professional Skills</Label>
                    <div className="flex gap-2">
                        <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="e.g. React, Python, Project Management"
                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                        />
                        <div className="w-[180px]">
                            <select
                                className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={newSkillLevel}
                                onChange={(e) => setNewSkillLevel(e.target.value as any)}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <Button type="button" onClick={addSkill} size="icon">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                        {skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1 px-3">
                                {skill.skill_name} <span className="text-xs opacity-70">({skill.level})</span>
                                <button onClick={() => removeSkill(index)} className="ml-1 hover:text-red-500">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Knowledge Domains Section */}
                <div className="space-y-4">
                    <Label>Knowledge Domains</Label>
                    <div className="flex gap-2">
                        <Input
                            value={newDomain}
                            onChange={(e) => setNewDomain(e.target.value)}
                            placeholder="e.g. Finance, Healthcare, AI"
                            onKeyDown={(e) => e.key === 'Enter' && addDomain()}
                        />
                        <Button type="button" onClick={addDomain} size="icon">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                        {domains.map((domain, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1 py-1 px-3">
                                {domain.domain}
                                <button onClick={() => removeDomain(index)} className="ml-1 hover:text-red-500">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
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
