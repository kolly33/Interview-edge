import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  Param,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadResume(@UploadedFile() file: Express.Multer.File) {
    try {
      const userId = '1234'; // This should be the user's ID
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
      const resume_id = await this.resumeService.uploadResume(userId, file);
      return { message: 'File uploaded', resume_id };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('status/:id')
  async checkUploadStatus(@Param('id') resumeId: string) {
    const status = await this.resumeService.checkStatus(resumeId);
    return { message: 'Upload status retrieved', status };
  }
}
