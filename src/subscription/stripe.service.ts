import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createCustomer(userId: string, email: string): Promise<string> {
    const customer = await this.stripe.customers.create({
      metadata: { userId },
      email,
    });
    return customer.id;
  }

  async createSubscription(
    customerId: string,
    plan: string,
    paymentMethodId: string,
  ): Promise<string> {
    // Attach payment method to customer
    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await this.stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    const priceId = this.getPriceIdForPlan(plan);
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription.id;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.stripe.subscriptions.cancel(subscriptionId);
  }

  async updateSubscription(
    subscriptionId: string,
    newPlan: string,
  ): Promise<void> {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
    const newPriceId = this.getPriceIdForPlan(newPlan);

    await this.stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
    });
  }

  private getPriceIdForPlan(plan: string): string {
    const prices = {
      starter: this.configService.get('STRIPE_PRICE_STARTER'),
      professional: this.configService.get('STRIPE_PRICE_PROFESSIONAL'),
      'power-user': this.configService.get('STRIPE_PRICE_POWER_USER'),
      enterprise: this.configService.get('STRIPE_PRICE_ENTERPRISE'),
      'pay-as-you-go': this.configService.get('STRIPE_PRICE_PAY_AS_YOU_GO'),
    };
    return prices[plan];
  }

  async handleWebhook(
    signature: string,
    payload: Buffer,
  ): Promise<{ type: string; data: any }> {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );

    return {
      type: event.type,
      data: event.data.object,
    };
  }
}
