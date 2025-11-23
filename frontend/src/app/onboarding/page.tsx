"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FACULTIES = [
    "International Relations",
    "International Law",
    "International Economics",
    "International Business",
    "International Communication",
    "English Language",
];

const MBTI_TYPES = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP",
];

const DISC_TYPES = ["D", "I", "S", "C"];

const INTERESTS = [
    "Politics", "Diplomacy", "Law", "Economics", "Finance", "Business",
    "Marketing", "Media", "Journalism", "Teaching", "Research", "Travel",
    "Art", "Technology", "Social Work",
];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            faculty: "",
            mbti: "",
            disc: "",
            interests: [] as string[],
        },
    });

    const formData = watch();

    const onSubmit = async (data: any) => {
        try {
            await api.post("/user/onboarding", data);
            router.push("/dashboard");
        } catch (err) {
            console.error("Onboarding failed", err);
        }
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const toggleInterest = (interest: string) => {
        const current = formData.interests;
        if (current.includes(interest)) {
            setValue("interests", current.filter(i => i !== interest));
        } else {
            setValue("interests", [...current, interest]);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Profile Setup (Step {step}/4)</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Step 1: Faculty */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <Label>Select your Faculty / Major</Label>
                                <div className="grid grid-cols-1 gap-2">
                                    {FACULTIES.map(f => (
                                        <div key={f}
                                            className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${formData.faculty === f ? 'border-primary bg-blue-50' : ''}`}
                                            onClick={() => setValue("faculty", f)}
                                        >
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                <Button type="button" onClick={nextStep} disabled={!formData.faculty} className="w-full">Next</Button>
                            </div>
                        )}

                        {/* Step 2: MBTI */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <Label>What is your MBTI type?</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {MBTI_TYPES.map(t => (
                                        <div key={t}
                                            className={`p-2 text-center border rounded cursor-pointer hover:bg-gray-50 ${formData.mbti === t ? 'border-primary bg-blue-50' : ''}`}
                                            onClick={() => setValue("mbti", t)}
                                        >
                                            {t}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" onClick={prevStep} className="w-1/2">Back</Button>
                                    <Button type="button" onClick={nextStep} disabled={!formData.mbti} className="w-1/2">Next</Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: DISC */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <Label>What is your primary DISC trait?</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {DISC_TYPES.map(t => (
                                        <div key={t}
                                            className={`p-4 text-center border rounded cursor-pointer hover:bg-gray-50 ${formData.disc === t ? 'border-primary bg-blue-50' : ''}`}
                                            onClick={() => setValue("disc", t)}
                                        >
                                            <span className="font-bold text-lg">{t}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" onClick={prevStep} className="w-1/2">Back</Button>
                                    <Button type="button" onClick={nextStep} disabled={!formData.disc} className="w-1/2">Next</Button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Interests */}
                        {step === 4 && (
                            <div className="space-y-4">
                                <Label>Select your Personal Interests</Label>
                                <div className="flex flex-wrap gap-2">
                                    {INTERESTS.map(i => (
                                        <div key={i}
                                            className={`px-3 py-1 border rounded-full cursor-pointer text-sm ${formData.interests.includes(i) ? 'bg-primary text-white border-primary' : 'hover:bg-gray-50'}`}
                                            onClick={() => toggleInterest(i)}
                                        >
                                            {i}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" onClick={prevStep} className="w-1/2">Back</Button>
                                    <Button type="submit" disabled={formData.interests.length === 0} className="w-1/2">Finish</Button>
                                </div>
                            </div>
                        )}

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
