import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OnboardingDto } from './dto/onboarding.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async saveProfile(userId: number, dto: OnboardingDto) {
        return this.prisma.studentProfile.upsert({
            where: { userId },
            update: {
                ...dto,
            },
            create: {
                userId,
                ...dto,
            },
        });
    }

    async getProfile(userId: number) {
        return this.prisma.studentProfile.findUnique({
            where: { userId },
        });
    }
}
