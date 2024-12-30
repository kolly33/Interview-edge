import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { InterviewService } from './interview.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post('start')
  async startSession(
    @Body('user_Id') userId: string,
  ): Promise<{ sessionId: string }> {
    const sessionId = await this.interviewService.startSession(userId);
    return { sessionId };
  }

  @Post('transcribe')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1024 * 1024 * 10 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('audio/')) {
          return callback(
            new BadRequestException(
              'Invalid file type, only audio file is accepted',
            ),
            false,
          );
        }
        return callback(null, true);
      },
    }),
  )
  async transcribe(
    @Body('sessionId') sessionId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return await this.interviewService.transcriptAudio(sessionId, file.buffer);
  }

  @Post('response')
  async addSuggestions(
    @Body('sessionId') session_id: string,
    @Body('suggestions') suggestions: string[],
  ): Promise<void> {
    await this.interviewService.addSuggestions(session_id, suggestions);
  }

  @Get('history/:userId')
  async getHistory(@Param('user_id') user_id: string): Promise<any[]> {
    const sessions = await this.interviewService.getUserSessions(user_id);
    return sessions.map((session) => ({
      sessionId: session.session_id,
      createdAt: session.createded_at,
      transcript: JSON.parse(session.transcript || '[]'),
      suggestions: JSON.parse(session.suggestions || '[]'),
    }));
  }
}
