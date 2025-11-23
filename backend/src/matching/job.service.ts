import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobService implements OnModuleInit {
    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        // Seed some data if empty
        const count = await this.prisma.job.count();
        if (count === 0) {
            await this.prisma.job.createMany({
                data: [
                    {
                        title: 'Diplomat',
                        description: 'Represent the country abroad.',
                        requiredSkills: ['Public Speaking', 'Negotiation', 'Writing'],
                        requiredKnowledge: ['International Relations', 'Law'],
                        suitableFaculties: ['International Relations', 'International Law'],
                        suitableMBTI: ['ENTJ', 'ENFJ'],
                        suitableDISC: ['D', 'I'],
                        suitableInterests: ['Politics', 'Travel'],
                    },
                    {
                        title: 'International Business Analyst',
                        description: 'Analyze market trends.',
                        requiredSkills: ['Data Analysis', 'Excel', 'English'],
                        requiredKnowledge: ['Economics', 'International Business'],
                        suitableFaculties: ['International Economics', 'International Business'],
                        suitableMBTI: ['INTJ', 'ISTJ'],
                        suitableDISC: ['C', 'D'],
                        suitableInterests: ['Finance', 'Business'],
                    },
                    {
                        title: 'Communications Specialist',
                        description: 'Manage public relations.',
                        requiredSkills: ['Writing', 'Social Media', 'Creativity'],
                        requiredKnowledge: ['Communication', 'Marketing'],
                        suitableFaculties: ['International Communication'],
                        suitableMBTI: ['ENFP', 'ESFP'],
                        suitableDISC: ['I', 'S'],
                        suitableInterests: ['Media', 'Art'],
                    },
                ],
            });
        }
    }

    async findAll() {
        return this.prisma.job.findMany();
    }

    async findOne(id: number) {
        return this.prisma.job.findUnique({ where: { id } });
    }
}
