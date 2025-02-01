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
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    const user_id = '12345';
    const subscription = await this.subscriptionService.create(
      user_id,
      createSubscriptionDto.plan_id,
    );
    return {
      success: true,
      message: 'Subscription created successfully',
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
