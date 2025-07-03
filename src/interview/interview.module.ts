import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { TranscriptionService } from './services/transcription.service';
import { AIService } from './services/ai.service';
import { InterviewSession } from './entities/interview-session.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([InterviewSession]),
  ],
  controllers: [InterviewController],
  providers: [
    InterviewService,
    TranscriptionService,
    AIService,
  ],
  exports: [InterviewService],
})
export class InterviewModule {}
