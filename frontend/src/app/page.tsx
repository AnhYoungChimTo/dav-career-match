import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Home() {
    return (
        <div className="min-h-screen bg-stripe-light">
            <Navigation />

            <Hero />

            {/* Features Section */}
            <div className="py-24 bg-stripe-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <Badge variant="default" className="mb-4">
                            Features
                        </Badge>
                        <h2 className="text-4xl font-bold text-stripe-dark mb-4">
                            Everything you need to succeed
                        </h2>
                        <p className="text-lg text-stripe-slate max-w-2xl mx-auto">
                            Our comprehensive platform combines AI-powered matching,
                            personalized roadmaps, and real-world projects.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="hover-lift">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-stripe-blue to-stripe-blurple rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-2xl">Personalized Matching</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-stripe-slate leading-relaxed">
                                    Get job recommendations tailored to your MBTI, DISC,
                                    faculty, and interests using our advanced AI algorithms.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover-lift">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <CardTitle className="text-2xl">Learning Roadmaps</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-stripe-slate leading-relaxed">
                                    Follow structured 3-month learning paths designed for
                                    each career option with curated resources and milestones.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover-lift">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-2xl">Real Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-stripe-slate leading-relaxed">
                                    Discover real-world internship projects to build practical
                                    experience in your chosen field and portfolio.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-20 text-center">
                        <div className="glass rounded-2xl p-12 max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-stripe-dark mb-4">
                                Ready to find your dream career?
                            </h2>
                            <p className="text-lg text-stripe-slate mb-8 max-w-2xl mx-auto">
                                Join thousands of students who have discovered their perfect career path.
                                Start your journey today—it's completely free.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/dashboard">
                                    <Button size="lg">
                                        View Dashboard
                                    </Button>
                                </Link>
                                <Link href="/onboarding">
                                    <Button size="lg" variant="secondary">
                                        Start Onboarding
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-stripe-dark py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-white/60">
                            © 2025 DAV Career Match. Powered by AI.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
