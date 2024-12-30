import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../session/session.repository';
import { Interview } from './entities/interview.entity';
import { TranscriptService } from 'src/transcript/transcript.service';

@Injectable()
export class InterviewService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly transcriptService: TranscriptService,
  ) {}

  // Start a new session
  async startSession(user_id: string): Promise<string> {
    const session = await this.sessionRepository.createSession(user_id);
    return session.session_id;
  }

  // Add transcript data
  async transcriptAudio(
    session_id: string,
    transcriptData: Buffer,
  ): Promise<string> {
    const session = await this.sessionRepository.findBySessionId(session_id);
    if (!session) throw new Error('Session not found');
    const updatedTranscript =
      await this.transcriptService.transcribeAudio(transcriptData);
    await this.sessionRepository.updateSessionData(session_id, {
      transcript: updatedTranscript,
    });
    return updatedTranscript;
  }

  // Add AI suggestions
  async addSuggestions(
    sessionId: string,
    suggestions: string[],
  ): Promise<void> {
    const session = await this.sessionRepository.findBySessionId(sessionId);
    if (!session) throw new Error('Session not found');
    const updatedSuggestions = JSON.stringify([
      ...(JSON.parse(session.suggestions || '[]') as string[]),
      ...suggestions,
    ]);
    await this.sessionRepository.updateSessionData(sessionId, {
      suggestions: updatedSuggestions,
    });
  }

  // Get session details
  async getSessionDetails(sessionId: string): Promise<Interview> {
    const session = await this.sessionRepository.findBySessionId(sessionId);
    if (!session) throw new Error('Session not found');
    return session;
  }

  // Get all sessions for a user
  async getUserSessions(user_id: string): Promise<Interview[]> {
    return await this.sessionRepository.getUserSessions(user_id);
  }
}
