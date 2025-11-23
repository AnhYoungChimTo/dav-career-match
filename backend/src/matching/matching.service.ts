import { Injectable } from '@nestjs/common';
import { JobService } from './job.service';
import { UserService } from '../user/user.service';

@Injectable()
export class MatchingService {
    constructor(
        private jobService: JobService,
        private userService: UserService,
    ) { }

    async matchJobs(userId: number) {
        const profile = await this.userService.getProfile(userId);
        if (!profile) return [];

        const jobs = await this.jobService.findAll();

        const scoredJobs = jobs.map(job => {
            let score = 0;

            // 1. Personality (35%)
            if (job.suitableMBTI.includes(profile.mbti)) score += 17.5;
            if (job.suitableDISC.includes(profile.disc)) score += 17.5;

            // 2. Knowledge (20%)
            if (job.suitableFaculties.includes(profile.faculty)) score += 20;

            // 3. Interests (35%)
            const interestMatch = job.suitableInterests.filter(i => profile.interests.includes(i)).length;
            if (interestMatch > 0) score += 35; // Simplified: any match gives full points for MVP

            // 4. Market Fit (10%)
            score += 10;

            return { ...job, score };
        });

        // Return top 5
        return scoredJobs.sort((a, b) => b.score - a.score).slice(0, 5);
    }
}
