// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post()
//   create(@Body() createAuthDto: CreateAuthDto) {
//     return this.authService.create(createAuthDto);
//   }

//   @Get()
//   findAll() {
//     return this.authService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.authService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
//     return this.authService.update(+id, updateAuthDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.authService.remove(+id);
//   }
// }


import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  // Redirect users to Auth0 for login
  @Get('login')
  @UseGuards(AuthGuard('auth0'))
  login() {
    // Auth0 handles the login redirect
  }

  // Auth0 redirects back to this route after successful login
  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  callback(@Req() req) {
    return {
      message: 'Logged in successfully!',
      user: req.user,
    };
  }

  // Example of a protected route
  @Get('protected')
  @UseGuards(AuthGuard('auth0'))
  getProtectedResource(@Req() req) {
    return {
      message: 'This is a protected route.',
      user: req.user,
    };
  }
}
