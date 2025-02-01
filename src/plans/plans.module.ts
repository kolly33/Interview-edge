import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Plan } from './entities/plan.entity';

@Module({
  imports: [SequelizeModule.forFeature([Plan])],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
