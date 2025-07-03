import { Controller, Post, Body, UseGuards, Get, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CodingService } from './coding.service';
import { StartCodingSessionDto, SubmitCodeDto } from './dto/coding.dto';

@Controller('coding')
@UseGuards(AuthGuard('jwt'))
export class CodingController {
  constructor(private readonly codingService: CodingService) {}

  @Post('start')
  async startSession(@Body() startSessionDto: StartCodingSessionDto) {
    return this.codingService.startSession(startSessionDto);
  }

  @Post('screenshot/:sessionId')
  @UseInterceptors(FileInterceptor('screenshot'))
  async uploadScreenshot(
    @Param('sessionId') sessionId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.codingService.saveScreenshot({
      sessionId,
      screenshot: file.buffer,
    });
  }

  @Post('submit')
  async submitCode(@Body() submitCodeDto: SubmitCodeDto) {
    return this.codingService.submitCode(submitCodeDto);
  }

  @Get(':sessionId')
  async getSession(@Param('sessionId') sessionId: string) {
    return this.codingService.getSession(sessionId);
  }
}
