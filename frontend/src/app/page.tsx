import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-50 to-white">
            <div className="text-center space-y-6 max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
                    DAV Career Match
                </h1>
                <p className="text-lg text-gray-600">
                    Discover your perfect career path based on your personality, interests, and academic background.
                    Designed exclusively for Diplomatic Academy of Vietnam students.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/auth/register">
                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                            Get Started
                        </Button>
                    </Link>
                    <Link href="/auth/login">
                        <Button variant="outline" size="lg">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
