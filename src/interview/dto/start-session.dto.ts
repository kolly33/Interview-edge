import { IsEnum, IsNotEmpty } from 'class-validator';

export class StartSessionDto {
  @IsNotEmpty()
  @IsEnum(['behavioral', 'technical', 'mock', 'live'])
  sessionType: string;

  @IsNotEmpty()
  userId: string;
}
