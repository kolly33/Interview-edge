import { Injectable } from "@nestjs/common";
import { SpeechClient } from "@google-cloud/speech";

@Injectable()
export class TranscriptService {
  constructor(private readonly speechClient: SpeechClient) {}


  async transcribeAudio(audio: Buffer): Promise<string> {
    const [response] = await this.speechClient.recognize({
      audio: {
        content: audio.toString('base64'),
      },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
    });
    const transcription = response.results.map((result) => result.alternatives[0].transcript).join(' ');
    return transcription || "No transcription Available";
}
  