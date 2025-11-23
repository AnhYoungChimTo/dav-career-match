import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MatchingService } from '../matching/matching.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const matchingService = app.get(MatchingService);
    const prisma = app.get(PrismaService);

    // Create a dummy user and profile for testing
    const email = 'test_matcher@example.com';
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                passwordHash: 'hashedpassword',
                profile: {
                    create: {
                        faculty: 'Marketing',
                        mbti: 'ENTJ', // Leader, Organizer
                        disc: 'D',    // Leader, Driver
                        interests: ['Social Media', 'Strategy']
                    }
                }
            }
        });
        console.log('Created test user:', user.id);
    } else {
        console.log('Using existing test user:', user.id);
    }

    console.log('Testing matching for user:', user.id);
    const matches = await matchingService.matchJobs(user.id);

    console.log(`Found ${matches.length} matches.`);
    if (matches.length > 0) {
        console.log('Top 3 Matches:');
        matches.slice(0, 3).forEach(job => {
            console.log(`- ${job.title} (${job.category}): Score ${job.score}`);
            console.log(`  Archetypes: ${job.archetypesFit.join(', ')}`);
        });
    }

    await app.close();
}

bootstrap();
