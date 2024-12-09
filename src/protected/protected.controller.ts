import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('protected') // Base route: /protected
export class ProtectedController {
  // Secure this route with JWT AuthGuard
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProtectedData(@Request() req) {
    return {
      message: 'This is a protected route.',
      user: req.user, // User details from JWT token
    };
  }
}
