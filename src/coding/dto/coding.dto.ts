import { IsNotEmpty, IsString } from 'class-validator';

export class StartCodingSessionDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  problemId: string;
}

export class SubmitScreenshotDto {
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @IsNotEmpty()
  screenshot: Buffer;
}

export class SubmitCodeDto {
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
