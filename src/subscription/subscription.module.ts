import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { Subscription } from './entities/subscription.entity';
import { PlansModule } from 'src/plans/plans.module';
import { PlansService } from 'src/plans/plans.service';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Subscription]),
    PlansModule,
    PaymentModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PlansService],
})
export class SubscriptionModule {}
