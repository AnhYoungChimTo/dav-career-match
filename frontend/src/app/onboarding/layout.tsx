import { ReactNode } from 'react'

export default function OnboardingLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="font-bold text-xl text-stripe-blue">DAV Career Match</div>
                    <div className="text-sm text-gray-500">Career Setup</div>
                </div>
            </header>
            <main className="flex-1 max-w-4xl mx-auto w-full p-6">
                {children}
            </main>
        </div>
    )
}
