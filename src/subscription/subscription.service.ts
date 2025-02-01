import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription)
    private subscriptionModel: typeof Subscription,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const subscription = await this.subscriptionModel.create(
      createSubscriptionDto,
    );
    return subscription;
  }

  findAll() {
    return this.subscriptionModel.findAll();
  }

  async findOne(id: string) {
    const subscription = await this.subscriptionModel.findOne({
      where: { id },
    });
    if (subscription) {
      return subscription;
    } else {
      throw new NotFoundException('Subscription not found');
    }
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    try {
      const subscription = await this.findOne(id);

      await subscription.update(updateSubscriptionDto);
      await subscription.save();

      return subscription;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    const subscription = await this.findOne(id);

    return await subscription.destroy();
  }
}
