import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InterviewSession } from './entities/interview-session.entity';
import { TranscriptionService } from './services/transcription.service';
import { AIService } from './services/ai.service';
import { StartSessionDto } from './dto/start-session.dto';
import { TranscribeDto } from './dto/transcribe.dto';

@Injectable()
export class InterviewService {
  constructor(
    @InjectModel(InterviewSession)
    private interviewSessionModel: typeof InterviewSession,
    private transcriptionService: TranscriptionService,
    private aiService: AIService,
  ) {}

  async startSession(startSessionDto: StartSessionDto): Promise<InterviewSession> {
    return await this.interviewSessionModel.create({
      ...startSessionDto,
      startTime: new Date(),
      transcript: '',
      suggestions: {},
      metadata: {},
    });
  }

  async processTranscription(transcribeDto: TranscribeDto) {
    const session = await this.interviewSessionModel.findByPk(transcribeDto.sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Get transcription
    const transcription = await this.transcriptionService.transcribeAudio(
      transcribeDto.audioData,
    );

    // Update transcript
    session.transcript = session.transcript + ' ' + transcription;

    // Generate AI suggestions
    const suggestions = await this.aiService.generateSuggestions(
      session.transcript,
      {
        sessionType: session.sessionType,
        previousResponses: session.metadata['previousResponses'] || [],
      },
    );

    // Update session with new data
    session.suggestions = suggestions;
    await session.save();

    return {
      transcription,
      suggestions,
    };
  }

  async endSession(sessionId: number): Promise<InterviewSession> {
    const session = await this.interviewSessionModel.findByPk(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.endTime = new Date();
    await session.save();
    return session;
  }
}
