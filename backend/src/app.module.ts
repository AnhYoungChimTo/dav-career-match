import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MatchingModule } from './matching/matching.module';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        UserModule,
        MatchingModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
