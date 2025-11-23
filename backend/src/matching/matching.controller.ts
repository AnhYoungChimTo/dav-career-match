import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MatchingService } from './matching.service';
import { JobService } from './job.service';

@Controller('matching')
export class MatchingController {
    constructor(
        private matchingService: MatchingService,
        private jobService: JobService
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('jobs')
    getMatches(@Request() req) {
        return this.matchingService.matchJobs(req.user.id);
    }

    @Get('jobs/:id')
    getJob(@Param('id') id: string) {
        return this.jobService.findOne(+id);
    }
}
