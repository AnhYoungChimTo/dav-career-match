import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { JobService } from '../matching/job.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const jobService = app.get(JobService);

    // Trigger onModuleInit manually if needed, but createApplicationContext should trigger it.
    // We will wait a bit to ensure seed is done if it's async.

    // Actually onModuleInit is awaited by NestJS.

    const jobs = await jobService.findAll();
    console.log(`Total jobs in database: ${jobs.length}`);

    if (jobs.length > 0) {
        console.log('First 3 jobs preview:');
        console.log(JSON.stringify(jobs.slice(0, 3), null, 2));
    }

    await app.close();
}

bootstrap();
