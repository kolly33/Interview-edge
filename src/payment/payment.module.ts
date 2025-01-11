import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { StripeService } from './stripe.service';

@Module({
  imports: [SequelizeModule.forFeature([Payment])],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService],
})
export class PaymentModule {}
