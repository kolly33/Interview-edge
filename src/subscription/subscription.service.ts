import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subscription } from './entities/subscription.entity';
import { StripeService } from './stripe.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto, CancelSubscriptionDto } from './dto/subscription.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscriptionService {
  private readonly planLimits = {
    starter: {
      maxInterviewSessions: 10,
      maxCodingSessions: 50,
      maxTokensPerSession: 10000,
    },
    professional: {
      maxInterviewSessions: 30,
      maxCodingSessions: 200,
      maxTokensPerSession: 20000,
    },
    'power-user': {
      maxInterviewSessions: 100,
      maxCodingSessions: 500,
      maxTokensPerSession: 20000,
    },
    enterprise: {
      maxInterviewSessions: -1, // unlimited
      maxCodingSessions: -1, // unlimited
      maxTokensPerSession: -1, // unlimited
    },
    'pay-as-you-go': {
      maxInterviewSessions: 1,
      maxCodingSessions: 1,
      maxTokensPerSession: 20000,
    },
  };

  constructor(
    @InjectModel(Subscription)
    private subscriptionModel: typeof Subscription,
    private stripeService: StripeService,
    private configService: ConfigService,
  ) {}

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    // Create or get Stripe customer
    const stripeCustomerId = await this.stripeService.createCustomer(
      createSubscriptionDto.userId,
      'user@example.com', // TODO: Get user's email
    );

    // Create Stripe subscription
    const stripeSubscriptionId = await this.stripeService.createSubscription(
      stripeCustomerId,
      createSubscriptionDto.plan,
      createSubscriptionDto.paymentMethodId,
    );

    // Create subscription record
    return await this.subscriptionModel.create({
      userId: createSubscriptionDto.userId,
      plan: createSubscriptionDto.plan,
      stripeCustomerId,
      stripeSubscriptionId,
      startDate: new Date(),
      status: 'active',
      usage: {
        interviewSessions: 0,
        codingSessions: 0,
        tokensUsed: 0,
      },
      limits: this.planLimits[createSubscriptionDto.plan],
    });
  }

  async updateSubscription(updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
    const subscription = await this.subscriptionModel.findByPk(updateSubscriptionDto.subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Update Stripe subscription
    await this.stripeService.updateSubscription(
      subscription.stripeSubscriptionId,
      updateSubscriptionDto.newPlan,
    );

    // Update subscription record
    subscription.plan = updateSubscriptionDto.newPlan;
    subscription.limits = this.planLimits[updateSubscriptionDto.newPlan];
    await subscription.save();

    return subscription;
  }

  async cancelSubscription(cancelSubscriptionDto: CancelSubscriptionDto): Promise<void> {
    const subscription = await this.subscriptionModel.findByPk(cancelSubscriptionDto.subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Cancel Stripe subscription
    await this.stripeService.cancelSubscription(subscription.stripeSubscriptionId);

    // Update subscription record
    subscription.status = 'cancelled';
    subscription.endDate = new Date();
    await subscription.save();
  }

  async checkUsageLimit(userId: string, type: 'interview' | 'coding'): Promise<boolean> {
    const subscription = await this.subscriptionModel.findOne({
      where: { userId, status: 'active' },
    });

    if (!subscription) {
      throw new Error('No active subscription found');
    }

    const { usage, limits } = subscription;
    const sessionType = type === 'interview' ? 'interviewSessions' : 'codingSessions';
    const maxSessions = limits[`max${sessionType.charAt(0).toUpperCase()}${sessionType.slice(1)}`];

    // -1 indicates unlimited sessions
    if (maxSessions === -1) return true;

    return usage[sessionType] < maxSessions;
  }

  async incrementUsage(userId: string, type: 'interview' | 'coding', tokens?: number): Promise<void> {
    const subscription = await this.subscriptionModel.findOne({
      where: { userId, status: 'active' },
    });

    if (!subscription) {
      throw new Error('No active subscription found');
    }

    const sessionType = type === 'interview' ? 'interviewSessions' : 'codingSessions';
    subscription.usage = {
      ...subscription.usage,
      [sessionType]: (subscription.usage[sessionType] || 0) + 1,
      tokensUsed: tokens ? (subscription.usage.tokensUsed || 0) + tokens : subscription.usage.tokensUsed,
    };

    await subscription.save();
  }

  async handleWebhookEvent(event: { type: string; data: any }): Promise<void> {
    switch (event.type) {
      case 'invoice.payment_failed':
        await this.handleFailedPayment(event.data.subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCancelled(event.data.id);
        break;
      // Add more webhook event handlers as needed
    }
  }

  private async handleFailedPayment(stripeSubscriptionId: string): Promise<void> {
    const subscription = await this.subscriptionModel.findOne({
      where: { stripeSubscriptionId },
    });

    if (subscription) {
      subscription.status = 'expired';
      await subscription.save();
    }
  }

  private async handleSubscriptionCancelled(stripeSubscriptionId: string): Promise<void> {
    const subscription = await this.subscriptionModel.findOne({
      where: { stripeSubscriptionId },
    });

    if (subscription) {
      subscription.status = 'cancelled';
      subscription.endDate = new Date();
      await subscription.save();
    }
  }
}
