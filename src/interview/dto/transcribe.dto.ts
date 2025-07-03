import { IsNotEmpty } from 'class-validator';

export class TranscribeDto {
  @IsNotEmpty()
  sessionId: number;

  @IsNotEmpty()
  audioData: string; // Base64 encoded audio chunk
}
