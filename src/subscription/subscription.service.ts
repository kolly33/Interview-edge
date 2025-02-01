import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { InjectModel } from '@nestjs/sequelize';
import { PlansService } from '../plans/plans.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription)
    private subscriptionModel: typeof Subscription,
    private planService: PlansService,
  ) {}

  async create(user_id: string, plan_id: string) {
    const plan = await this.planService.findOne(plan_id);
    const start_date = new Date();
    const end_date = new Date(start_date);
    end_date.setDate(start_date.getDate() + plan.duration_in_days);
    const subscription = await this.subscriptionModel.create({
      user_id,
      plan_id,
      start_date,
      end_date,
    });
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
