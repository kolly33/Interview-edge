import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async paymentIntent(amount: number, email: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd',
        payment_method_types: ['card'],
        receipt_email: email,
      });

      return paymentIntent;
    } catch (error) {
      throw new Error(`Stripe payment intent failed: ${error.message}`);
    }
  }

  async confirmPaymentIntent(paymentIntentId: string) {
    try {
      // const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);

      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: 'pm_card_visa',
          return_url: 'https://www.example.com',
        },
      );

      return paymentIntent;
    } catch (error) {
      throw new Error(`Stripe confirm payment intent failed: ${error.message}`);
    }
  }

  async handleWebhook(payload: any, sig: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        sig,
        this.configService.get('STRIPE_WEBHOOK_SECRET'),
      );

      return event;
    } catch (error) {
      throw new Error(`Stripe webhook failed: ${error.message}`);
    }
  }
}
