import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './entities/payment.entity';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    private stripe: StripeService,
  ) {}

  async initiatePayment(user_id: string, amount: number, email: string) {
    try {
      const response = await this.stripe.paymentIntent(amount, email);
      // console.log('Response from payment intent', response);
      // const payment_intent_id: response.id;
      // console.log('Payment intent id is ', payment_intent_id);
      const payment = await this.paymentModel.create({
        payment_intent_id: response.id as string,
        user_id,
        amount,
      });
      console.log('Payment object', payment);
      // console.log('Response from payment intent', response);
      return payment;
    } catch (error) {
      console.log('Error from payment intent', error);
      throw new BadRequestException(error.message);
    }
    // Logic to charge the customer
  }
  async handlePayment(paymentIntendId: string) {
    try {
      const response = await this.stripe.confirmPaymentIntent(paymentIntendId);
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Fetch user payment status and subscription status
  async checkPaymentStatus(user_id: string, subscription_id: string) {
    // Logic to check user payment status and subscription status
    return { user_id, subscription_id };
  }

  async handleWebhook(payload: any, sig: any) {
    const event = await this.stripe.handleWebhook(payload, sig);
    console.log('event type', event.type);
    console.log('Event object is ', event.data.object);

    switch (event.type) {
      case 'payment_intent.created':
        const paymentIntentCreated = event.data.object;

        console.log('PaymentIntent was created!', paymentIntentCreated);
        break;
      case 'payment_intent.processing':
        const paymentIntentProcessing = event.data.object;
        console.log('PaymentIntent is processing!', paymentIntentProcessing);
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful!', paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const paymentIntentPaymentFailed = event.data.object;
        console.log('PaymentIntent has failed', paymentIntentPaymentFailed);
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
