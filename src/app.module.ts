import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProtectedModule } from './protected/protected.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [AuthModule, ProtectedModule,ConfigModule.forRoot({
    isGlobal: true, // Makes the configuration globally accessible
    envFilePath: '.env', // Path to your .env file (default is '.env')
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
