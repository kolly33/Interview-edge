import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import Configuration from 'openai';

@Injectable()
export class TranscriptService {
  constructor(
    private readonly openAI: OpenAI,
    private readonly configuration: Configuration,
  ) {}

  async transcribeAudio(audio: Buffer): Promise<string> {
    const file = new File([audio], 'audio.wav', { type: 'audio/wav' });
    const transcription = await this.openAI.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });

    const text = transcription.text;
    return text;
  }
}
