"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null);
    const [jobs, setJobs] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, jobsRes] = await Promise.all([
                    api.get("/user/profile"),
                    api.get("/matching/jobs"),
                ]);
                setProfile(profileRes.data);
                setJobs(jobsRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };
        fetchData();
    }, []);

    if (!profile) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Profile Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Faculty</p>
                            <p className="font-medium">{profile.faculty}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">MBTI</p>
                            <p className="font-medium">{profile.mbti}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">DISC</p>
                            <p className="font-medium">{profile.disc}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Interests</p>
                            <p className="font-medium">{profile.interests.join(", ")}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Job Matches */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Recommended Jobs</h2>
                    <div className="grid gap-4">
                        {jobs.map((job) => (
                            <Card key={job.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>{job.title}</CardTitle>
                                        <p className="text-sm text-gray-500 mt-1">{job.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                                            {job.score}% Match
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2 mb-4">
                                        {job.requiredSkills.slice(0, 3).map((skill: string) => (
                                            <span key={skill} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <Link href={`/roadmap/${job.id}`}>
                                        <Button variant="outline" className="w-full">View Roadmap & Gaps</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
