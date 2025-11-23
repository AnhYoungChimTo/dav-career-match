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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/matching/jobs/${params.id}`);
                setJob(res.data);
            } catch (err: any) {
                console.error("Failed to fetch job", err);
                setError(err.message || "Failed to load job details");
            }
        };
        if (params.id) fetchJob();
    }, [params.id]);

    if (error) return <div className="p-8 text-red-500">Error loading job: {error}</div>;
    if (!job) return <div className="p-8">Loading Job Details... (ID: {params.id})</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Link href="/dashboard">
                    <Button variant="ghost" className="mb-4">← Back to Dashboard</Button>
                </Link>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">{job.title}</h1>
                    <p className="text-gray-600">{job.shortDescription}</p>
                </div>

                {/* Skills & Tools */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hard Skills</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {job.hardSkills?.map((skill: string) => (
                                <div key={skill}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{skill}</span>
                                        <span className="text-gray-500">Target</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-400 w-[60%]"></div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tools & Soft Skills</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2 text-sm">Tools</h4>
                                <div className="flex flex-wrap gap-2">
                                    {job.tools?.map((t: string) => (
                                        <span key={t} className="px-2 py-1 bg-gray-100 rounded text-xs">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 text-sm">Soft Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {job.softSkills?.map((s: string) => (
                                        <span key={s} className="px-2 py-1 bg-green-50 text-green-700 border border-green-100 rounded text-xs">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 3-Month Learning Path */}
                <Card>
                    <CardHeader>
                        <CardTitle>3-Month Learning Path</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 py-4">
                            {job.learningPath && Object.entries(job.learningPath).map(([month, activity]: [string, any]) => (
                                <div key={month} className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white"></div>
                                    <h4 className="font-bold text-lg capitalize">{month.replace(/(\d+)/, ' $1')}</h4>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {activity}
                                    </p>
                                </div>
                            ))}

                            <div className="relative pl-8">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-white"></div>
                                <h4 className="font-bold text-lg">Internship Project</h4>
                                <p className="text-gray-600 text-sm mt-1">
                                    {job.internshipProject}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
