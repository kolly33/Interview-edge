import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Resume } from './entities/resume.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [SequelizeModule.forFeature([Resume]), CloudinaryModule],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
