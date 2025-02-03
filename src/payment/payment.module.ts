import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { StripeService } from './stripe.service';
import { PlansModule } from 'src/plans/plans.module';
import { PlansService } from 'src/plans/plans.service';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Payment]),
    PlansModule,
    forwardRef(() => SubscriptionModule),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService, PlansService],
  exports: [PaymentService, SequelizeModule, StripeService],
})
export class PaymentModule {}
