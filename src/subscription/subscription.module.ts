import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { Subscription } from './entities/subscription.entity';
import { PlansModule } from 'src/plans/plans.module';
import { PlansService } from 'src/plans/plans.service';

@Module({
  imports: [SequelizeModule.forFeature([Subscription]), PlansModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PlansService],
})
export class SubscriptionModule {}
