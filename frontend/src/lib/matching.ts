
// Basic matching logic for MVP
// In a real app, this would be more complex and likely server-side or using embeddings.

interface Job {
    id: string;
    title: string;
    domain: string;
    required_skills: Record<string, string[]>; // e.g. { "Intern": ["Skill A"], "Fresher": ["Skill B"] }
    required_knowledge: string[];
    mbti_fit: string[];
    disc_fit: string[];
}

interface UserProfile {
    mbti: string;
    disc: string;
    skills: { skill_name: string; level: string }[];
    knowledge_domains: { domain: string }[];
    career_preferences: { interest_domains: string[] };
}

export function calculateMatch(job: Job, user: UserProfile): { score: number; reasons: string[]; gaps: string[] } {
    let score = 0;
    const reasons: string[] = [];
    const gaps: string[] = [];

    // 1. MBTI Match (15%)
    if (job.mbti_fit && job.mbti_fit.includes(user.mbti)) {
        score += 15;
        reasons.push(`Matches your MBTI type (${user.mbti})`);
    }

    // 2. DISC Match (15%)
    if (job.disc_fit && job.disc_fit.includes(user.disc)) {
        score += 15;
        reasons.push(`Matches your DISC profile (${user.disc})`);
    }

    // 3. Interest/Domain Match (20%)
    // Check if job domain is in user's interest domains
    if (user.career_preferences?.interest_domains?.includes(job.domain)) {
        score += 20;
        reasons.push(`Aligns with your interest in ${job.domain}`);
    }

    // 4. Skills Match (30%)
    // Flatten job skills
    let jobSkills: string[] = [];
    if (job.required_skills) {
        if (Array.isArray(job.required_skills)) {
            jobSkills = job.required_skills as string[];
        } else {
            Object.values(job.required_skills).forEach(s => {
                if (Array.isArray(s)) jobSkills.push(...s);
            });
        }
    }

    // User skills
    const userSkillNames = user.skills.map(s => s.skill_name);

    if (jobSkills.length > 0) {
        const matchingSkills = jobSkills.filter(s => userSkillNames.includes(s));
        const skillMatchRatio = matchingSkills.length / jobSkills.length;
        score += Math.round(skillMatchRatio * 30);

        if (skillMatchRatio > 0.5) {
            reasons.push(`You have ${matchingSkills.length} matching skills`);
        }

        // Identify gaps
        jobSkills.forEach(s => {
            if (!userSkillNames.includes(s)) {
                gaps.push(s);
            }
        });
    } else {
        // If no skills required, give full points? Or neutral.
        score += 30;
    }

    // 5. Knowledge Match (20%)
    const userKnowledge = user.knowledge_domains.map(k => k.domain);
    if (job.required_knowledge && job.required_knowledge.length > 0) {
        const matchingKnowledge = job.required_knowledge.filter(k => userKnowledge.includes(k));
        const knowledgeMatchRatio = matchingKnowledge.length / job.required_knowledge.length;
        score += Math.round(knowledgeMatchRatio * 20);

        if (knowledgeMatchRatio > 0.5) {
            reasons.push(`You have strong knowledge in required domains`);
        }
    } else {
        score += 20;
    }

    return { score, reasons, gaps };
}
