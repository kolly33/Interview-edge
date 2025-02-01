import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  async findAll() {
    const subscriptions = await this.subscriptionService.findAll();
    return {
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
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(id);
  }
}
