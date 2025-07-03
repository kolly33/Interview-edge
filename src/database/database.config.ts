import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  dialect: 'mysql',
  database: configService.get<string>('DB_NAME','interviewEdge'),
  username: configService.get<string>('DB_USERNAME', 'root'), // Default username if not found
  password: configService.get<string>('DB_PASSWORD', 'kolajoy111'), // Default password if not found
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  autoLoadModels: true,
  synchronize: true,
});
