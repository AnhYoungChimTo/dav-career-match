import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class OnboardingDto {
    @IsNotEmpty()
    @IsString()
    faculty: string;

    @IsNotEmpty()
    @IsString()
    mbti: string;

    @IsNotEmpty()
    @IsString()
    disc: string;

    @IsArray()
    @IsString({ each: true })
    interests: string[];
}
