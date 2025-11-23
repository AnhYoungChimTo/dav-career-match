import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { JobService } from './job.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [UserModule],
    controllers: [MatchingController],
    providers: [MatchingService, JobService],
})
export class MatchingModule { }
