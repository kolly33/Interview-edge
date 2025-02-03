import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './entities/payment.entity';
import { StripeService } from './stripe.service';
import { PlansService } from 'src/plans/plans.service';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    @Inject(forwardRef(() => SubscriptionService))
    private subscriptionService: SubscriptionService,
    private stripe: StripeService,
    private planService: PlansService,
  ) {}

  async initiatePayment(user_id: string, email: string, plan_id: string) {
    try {
      const plan = await this.planService.findOne(plan_id);
      // Check if user has a pending payment for the same plan
      const pendingPayment = await this.paymentModel.findOne({
        where: {
          user_id,
          plan_id,
          status: 'pending',
        },
      });

      if (pendingPayment) {
        return pendingPayment;
      }

      const response = await this.stripe.paymentIntent(plan.price, email);

      const payment = await this.paymentModel.create({
        payment_intent_id: response.id as string,
        user_id,
        amount: plan.price,
        plan_id,
      });
      // console.log('Payment object', payment);
      // console.log('Response from payment intent', response);
      return payment;
    } catch (error) {
      // console.log('Error from payment intent', error);
      throw new BadRequestException(error.message);
    }
  }

  async handlePayment(paymentIntendId: string) {
    try {
      const response = await this.stripe.confirmPaymentIntent(paymentIntendId);

      const responseData = {
        status: response.status,
        amount: response.amount,
        currency: response.currency,
      };
      return responseData;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Fetch user payment status and subscription status
  async checkPaymentStatus(user_id: string, subscription_id: string) {
    // Logic to check user payment status and subscription status
    return { user_id, subscription_id };
  }

  async updatePaymentStatus(payment_id: string, status: string) {
    const payment = await this.paymentModel.findOne({
      where: { payment_intent_id: payment_id },
    });
    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    payment.status = status;
    await payment.save();

    if (status === 'succeeded') {
      await this.subscriptionService.activateSubscription(
        payment.user_id,
        payment.plan_id,
      );
    }

    return payment;
  }

  async getPayments() {
    const payments = await this.paymentModel.findAll();
    return payments;
  }

  async handleWebhook(payload: any, sig: any) {
    const event = await this.stripe.handleWebhook(payload, sig);
    // console.log('event type', event.type);

    switch (event.type) {
      case 'payment_intent.processing':
        const paymentIntentProcessing = event.data.object;
        this.updatePaymentStatus(
          paymentIntentProcessing.id,
          paymentIntentProcessing.status,
        );
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        this.updatePaymentStatus(paymentIntent.id, paymentIntent.status);
        break;
      case 'payment_intent.payment_failed':
        const paymentIntentPaymentFailed = event.data.object;
        this.updatePaymentStatus(
          paymentIntentPaymentFailed.id,
          paymentIntentPaymentFailed.status,
        );

        break;
      // ... handle other event types
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}`);
    }

    // Logic to handle webhook
    return true;
  }
}
