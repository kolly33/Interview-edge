import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { StripeService } from './stripe.service';
import { Subscription } from './entities/subscription.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Subscription]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, StripeService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
