import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Interview } from './entities/interview.entity';
import { SessionRepository } from 'src/session/session.repository';

@Module({
  imports: [SequelizeModule.forFeature([Interview])],
  controllers: [InterviewController],
  providers: [InterviewService, SessionRepository],
})
export class InterviewModule {}
