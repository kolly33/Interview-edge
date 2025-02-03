import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  @HttpCode(200)
  async create(@Body('plan_id') plan_id: string) {
    const user_id = '123450'; // Retrieve from user
    const email = 'olajosh94@gmail.com'; // Retrieve from user
    const subscription = await this.subscriptionService.subscribe(
      user_id,
      email,
      plan_id,
    );
    return {
      success: true,
      message: 'Subscription payment initiated successfully',
      data: subscription,
    };
  }

  @Get()
  async findAll() {
    const subscriptions = await this.subscriptionService.findAll();
    return {
      success: true,
      message: 'Subscriptions fetched successfully',
      data: subscriptions,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const subscription = await this.subscriptionService.findOne(id);
    return {
      success: true,
      message: 'Subscription fetched successfully',
      data: subscription,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    const subscription = await this.subscriptionService.update(
      id,
      updateSubscriptionDto,
    );
    return {
      success: true,
      message: 'Subscription updated successfully',
      data: subscription,
    };
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(id);
  }
}
