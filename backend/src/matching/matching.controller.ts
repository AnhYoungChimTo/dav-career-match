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

    @Get('test/:userId')
    getMatchesTest(@Param('userId') userId: string) {
        return this.matchingService.matchJobs(+userId);
    }

    @Get('jobs/:id')
    getJob(@Param('id') id: string) {
        return this.jobService.findOne(+id);
    }
}
