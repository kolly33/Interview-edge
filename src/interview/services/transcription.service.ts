import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AssemblyAI from 'assemblyai';

@Injectable()
export class TranscriptionService {
  private assemblyAI: any;

  constructor(private configService: ConfigService) {
    this.assemblyAI = new AssemblyAI({
      apiKey: this.configService.get('ASSEMBLY_AI_API_KEY'),
    });
  }

  async transcribeAudio(audioData: string): Promise<string> {
    try {
      const response = await this.assemblyAI.transcripts.create({
        audio: audioData,
        language_code: 'en-US',
      });

      return response.text;
    } catch (error) {
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }
}
