import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobService implements OnModuleInit {
    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        // Seed some data if empty
        const count = await this.prisma.job.count();
        if (count === 0) {
            console.log('Seeding jobs...');
            const { JOBS_DATA } = await import('./jobs.data');

            for (const job of JOBS_DATA) {
                await this.prisma.job.create({
                    data: job
                });
            }
            console.log(`Seeded ${JOBS_DATA.length} jobs.`);
        }
    }

    async findAll() {
        return this.prisma.job.findMany();
    }

    async findOne(id: number) {
        return this.prisma.job.findUnique({ where: { id } });
    }
}
