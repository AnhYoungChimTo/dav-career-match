import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { OnboardingDto } from './dto/onboarding.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
    constructor(private userService: UserService) { }

    @Post('onboarding')
    saveProfile(@Request() req, @Body() dto: OnboardingDto) {
        return this.userService.saveProfile(req.user.id, dto);
    }

    @Get('profile')
    getProfile(@Request() req) {
        return this.userService.getProfile(req.user.id);
    }
}
