import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CodingController } from './coding.controller';
import { CodingService } from './coding.service';
import { ScreenshotService } from './services/screenshot.service';
import { CodingSession } from './entities/coding-session.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    SequelizeModule.forFeature([CodingSession]),
    CloudinaryModule,
  ],
  controllers: [CodingController],
  providers: [CodingService, ScreenshotService],
  exports: [CodingService],
})
export class CodingModule {}
