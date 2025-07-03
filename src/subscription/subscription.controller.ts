import { Controller, Post, Body, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionService } from './subscription.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  CancelSubscriptionDto,
} from './dto/subscription.dto';

@Controller('subscription')
@UseGuards(AuthGuard('jwt'))
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(createSubscriptionDto);
  }

  @Put(':id')
  async updateSubscription(@Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionService.updateSubscription(updateSubscriptionDto);
  }

  @Delete(':id')
  async cancelSubscription(@Body() cancelSubscriptionDto: CancelSubscriptionDto) {
    return this.subscriptionService.cancelSubscription(cancelSubscriptionDto);
  }

  @Post('webhook')
  async handleWebhook(@Body() event: any) {
    return this.subscriptionService.handleWebhookEvent(event);
  }
}
