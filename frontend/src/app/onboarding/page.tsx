'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'

// Step Components (will be implemented separately or inline for now)
import PersonalBasics from './steps/PersonalBasics'
import SkillsKnowledge from './steps/SkillsKnowledge'
import Personality from './steps/Personality'
import CareerGoals from './steps/CareerGoals'

export default function OnboardingPage() {
    const router = useRouter()
    const supabase = createClient() as any
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/auth?mode=login')
                return
            }
            setUserId(user.id)

            // Ideally we check which step they are on based on filled data, 
            // but for now we start at 1 or load from a local state if we wanted to be fancy.
            // The requirement says "Save & Continue", so we assume data is saved.
            // We could check if profile exists, if skills exist, etc to resume.
            // For simplicity and robustness, let's just load Step 1 data and if it's full, maybe user manually clicks next?
            // Or we can just start at 1.

            setLoading(false)
        }
        checkUser()
    }, [router, supabase])

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1)
        } else {
            // Finish
            router.push('/dashboard')
        }
    }

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-stripe-blue" />
            </div>
        )
    }

    const progress = (step / 4) * 100

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Step {step} of 4</span>
                    <span>{progress}% Completed</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <Card>
                {step === 1 && <PersonalBasics userId={userId!} onNext={handleNext} />}
                {step === 2 && <SkillsKnowledge userId={userId!} onNext={handleNext} onBack={handleBack} />}
                {step === 3 && <Personality userId={userId!} onNext={handleNext} onBack={handleBack} />}
                {step === 4 && <CareerGoals userId={userId!} onNext={handleNext} onBack={handleBack} />}
            </Card>
        </div>
    )
}
