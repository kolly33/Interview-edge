import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CodingSession } from './entities/coding-session.entity';
import { ScreenshotService } from './services/screenshot.service';
import { StartCodingSessionDto, SubmitScreenshotDto, SubmitCodeDto } from './dto/coding.dto';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CodingService {
  private openai: OpenAIApi;

  constructor(
    @InjectModel(CodingSession)
    private codingSessionModel: typeof CodingSession,
    private screenshotService: ScreenshotService,
    private configService: ConfigService,
  ) {
    const configuration = new Configuration({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
    this.openai = new OpenAIApi(configuration);
  }

  async startSession(startSessionDto: StartCodingSessionDto): Promise<CodingSession> {
    return await this.codingSessionModel.create({
      ...startSessionDto,
      status: 'in-progress',
      screenshots: [],
      startTime: new Date(),
    });
  }

  async saveScreenshot(submitScreenshotDto: SubmitScreenshotDto) {
    const session = await this.codingSessionModel.findByPk(submitScreenshotDto.sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const screenshotUrl = await this.screenshotService.saveScreenshot(
      submitScreenshotDto.sessionId,
      submitScreenshotDto.screenshot,
    );

    session.screenshots = [...(session.screenshots || []), screenshotUrl];
    await session.save();
    
    return screenshotUrl;
  }

  async submitCode(submitCodeDto: SubmitCodeDto) {
    const session = await this.codingSessionModel.findByPk(submitCodeDto.sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.code = submitCodeDto.code;
    session.status = 'completed';
    session.endTime = new Date();

    // Evaluate code using OpenAI
    const evaluation = await this.evaluateCode(submitCodeDto.code);
    session.evaluation = evaluation;
    session.score = evaluation.score;
    session.feedback = evaluation.feedback;

    await session.save();
    return session;
  }

  private async evaluateCode(code: string): Promise<{ score: number; feedback: string }> {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a code evaluation assistant. Evaluate the following code for correctness, efficiency, and best practices."
          },
          {
            role: "user",
            content: code
          }
        ]
      });

      const feedback = response.data.choices[0].message?.content || '';
      
      // Calculate score based on feedback (simple implementation)
      const score = feedback.includes('error') ? 0 : 
                   feedback.includes('improve') ? 0.7 : 1;

      return {
        score,
        feedback
      };
    } catch (error) {
      throw new Error(`Code evaluation failed: ${error.message}`);
    }
  }

  async getSession(sessionId: string): Promise<CodingSession> {
    const session = await this.codingSessionModel.findByPk(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  }
}
