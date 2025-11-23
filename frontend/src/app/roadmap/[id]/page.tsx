"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RoadmapPage() {
    const params = useParams();
    const [job, setJob] = useState<any>(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/matching/jobs/${params.id}`);
                setJob(res.data);
            } catch (err) {
                console.error("Failed to fetch job", err);
            }
        };
        if (params.id) fetchJob();
    }, [params.id]);

    if (!job) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Link href="/dashboard">
                    <Button variant="ghost" className="mb-4">← Back to Dashboard</Button>
                </Link>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">{job.title}</h1>
                    <p className="text-gray-600">{job.description}</p>
                </div>

                {/* Gap Analysis (Mocked Visuals for MVP) */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Gap Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {job.requiredSkills.map((skill: string, i: number) => (
                                <div key={skill}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{skill}</span>
                                        <span className="text-gray-500">Missing</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-400 w-[20%]"></div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Knowledge Gap</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {job.requiredKnowledge.map((k: string) => (
                                <div key={k} className="p-3 bg-yellow-50 border border-yellow-100 rounded-md text-sm">
                                    <span className="font-semibold block text-yellow-800">Gap Identified</span>
                                    Need to acquire knowledge in {k}.
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Roadmap */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Personalized Roadmap</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 py-4">
                            {job.requiredSkills.map((skill: string, i: number) => (
                                <div key={skill} className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white"></div>
                                    <h4 className="font-bold text-lg">Learn {skill}</h4>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Recommended Course: "Introduction to {skill} for Beginners" (Coursera/Udemy)
                                    </p>
                                    <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        Estimated time: 2 weeks
                                    </span>
                                </div>
                            ))}
                            <div className="relative pl-8">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-white"></div>
                                <h4 className="font-bold text-lg">Apply for Internship</h4>
                                <p className="text-gray-600 text-sm mt-1">
                                    Once you have completed the above steps, start applying for intern positions at NGOs or Embassies.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
