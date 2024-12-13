import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { InterviewService } from './interview.service';

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
  async transcribe(
    @Body('sessionId') sessionId: string,
    @Body('transcript') transcript: string,
  ): Promise<void> {
    await this.interviewService.addTranscript(sessionId, transcript);
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
