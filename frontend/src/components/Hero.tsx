"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

export function Hero() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 gradient-animated grid-pattern" />

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stripe-dark/10 to-stripe-dark/30" />

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="animate-fade-in">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 animate-float">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                        AI-Powered Career Matching
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        Find Your Perfect
                        <br />
                        <span className="inline-block bg-gradient-to-r from-white via-blue-100 to-teal-200 bg-clip-text text-transparent animate-pulse">
                            Career Path
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Discover your ideal career with our intelligent matching system.
                        Combining personality assessment, skill analysis, and industry insights
                        to guide your professional journey.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg" variant="secondary" className="min-w-[200px]">
                            Get Started Free
                        </Button>
                        <Button
                            size="lg"
                            variant="ghost"
                            className="min-w-[200px] text-white hover:bg-white/10 border-2 border-white/30"
                        >
                            Learn More
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="text-4xl font-bold text-white mb-2">10k+</div>
                            <div className="text-sm text-white/70">Students Matched</div>
                        </div>
                        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="text-4xl font-bold text-white mb-2">500+</div>
                            <div className="text-sm text-white/70">Career Paths</div>
                        </div>
                        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <div className="text-4xl font-bold text-white mb-2">95%</div>
                            <div className="text-sm text-white/70">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stripe-light to-transparent" />
        </div>
    );
}
