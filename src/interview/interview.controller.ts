import { 
  Controller, 
  Post, 
  Body, 
  UseGuards,
  Get,
  Param 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InterviewService } from './interview.service';
import { StartSessionDto } from './dto/start-session.dto';
import { TranscribeDto } from './dto/transcribe.dto';

@Controller('interview')
@UseGuards(AuthGuard('jwt'))
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post('start')
  async startSession(@Body() startSessionDto: StartSessionDto) {
    return this.interviewService.startSession(startSessionDto);
  }

  @Post('transcribe')
  async transcribe(@Body() transcribeDto: TranscribeDto) {
    return this.interviewService.processTranscription(transcribeDto);
  }

  @Post('end/:id')
  async endSession(@Param('id') id: number) {
    return this.interviewService.endSession(id);
  }
}
