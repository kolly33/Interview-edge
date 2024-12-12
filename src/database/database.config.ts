import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  dialect: 'mysql',
  database: configService.get<string>('DB_NAME'),
  username: configService.get<string>('DB_USERNAME', 'edge'), // Default username if not found
  password: configService.get<string>('DB_PASSWORD', 'password'), // Default password if not found
  host: configService.get<string>('DB_HOST', '127.0.0.1'),
  port: configService.get<number>('DB_PORT', 3306),
  autoLoadModels: true,
  synchronize: true,
});
