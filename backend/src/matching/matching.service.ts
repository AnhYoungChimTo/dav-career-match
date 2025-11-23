import { Injectable } from '@nestjs/common';
import { JobService } from './job.service';
import { UserService } from '../user/user.service';

@Injectable()
export class MatchingService {
    constructor(
        private jobService: JobService,
        private userService: UserService,
    ) { }

    // Simplified Archetype Mapping (MBTI/DISC -> Archetypes)
    private getArchetypes(mbti: string, disc: string): string[] {
        const archetypes = new Set<string>();

        // MBTI Mapping
        if (['ENTJ', 'ESTJ'].includes(mbti)) archetypes.add('leader').add('organizer');
        if (['INTJ', 'INTP'].includes(mbti)) archetypes.add('strategist').add('analyst');
        if (['ENFJ', 'ESFJ'].includes(mbti)) archetypes.add('connector').add('supporter');
        if (['INFJ', 'INFP'].includes(mbti)) archetypes.add('advocate').add('counselor');
        if (['ESTP', 'ESFP'].includes(mbti)) archetypes.add('promoter').add('performer');
        if (['ISTP', 'ISFP'].includes(mbti)) archetypes.add('creator').add('technician');
        if (['ENTP', 'ENFP'].includes(mbti)) archetypes.add('innovator').add('visionary');
        if (['ISTJ', 'ISFJ'].includes(mbti)) archetypes.add('administrator').add('protector');

        // DISC Mapping
        if (disc === 'D') archetypes.add('leader').add('driver');
        if (disc === 'I') archetypes.add('influencer').add('communicator');
        if (disc === 'S') archetypes.add('supporter').add('coordinator');
        if (disc === 'C') archetypes.add('analyst').add('evaluator');

        return Array.from(archetypes);
    }

    async matchJobs(userId: number) {
        const profile = await this.userService.getProfile(userId);
        if (!profile) return [];

        const jobs = await this.jobService.findAll();
        const studentArchetypes = this.getArchetypes(profile.mbti, profile.disc);

        const scoredJobs = jobs.map(job => {
            let score = 0;

            // 1. Archetype Fit (40%)
            // Check intersection between student archetypes and job archetypesFit
            const archetypeMatch = job.archetypesFit.filter(a => studentArchetypes.includes(a)).length;
            if (archetypeMatch > 0) score += 40; // Simplified: any match gives full points

            // 2. Domain/Faculty Fit (30%)
            // Heuristic: Check if job domain is related to faculty
            if (job.domain.includes(profile.faculty) || profile.faculty.includes(job.domain)) {
                score += 30;
            }

            // 3. Interests/Skills Fit (20%)
            // Check if any student interest matches job hard/soft skills or category
            const interestMatch = profile.interests.some(interest =>
                job.hardSkills.includes(interest) ||
                job.softSkills.includes(interest) ||
                job.category === interest
            );
            if (interestMatch) score += 20;

            // 4. Market Fit (10%)
            // Default points for now
            score += 10;

            return { ...job, score };
        });

        // Return top 10 matches
        return scoredJobs.sort((a, b) => b.score - a.score).slice(0, 10);
    }
}
