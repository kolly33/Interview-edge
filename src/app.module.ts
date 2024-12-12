import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProtectedModule } from './protected/protected.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResumeModule } from './resume/resume.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './database/database.config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration globally accessible
      envFilePath: '.env', // Path to your .env file (default is '.env')
    }),
    CloudinaryModule,
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        databaseConfig(configService),
      inject: [ConfigService],
    }),
    AuthModule,
    ProtectedModule,
    ResumeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
