import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Auth0Strategy } from './strategies/auth0.strategy';

import { AuthService } from './auth.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'auth0' })],
  providers: [AuthService, Auth0Strategy],
  exports: [AuthService],
})
export class AuthModule {}
