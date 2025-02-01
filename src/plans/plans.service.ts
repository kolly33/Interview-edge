import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan)
    private planModel: typeof Plan,
  ) {}

  async create(createPlanDto: CreatePlanDto) {
    console.log('Create plan dto', createPlanDto);
    const plan = await this.planModel.create(createPlanDto);
    return plan;
  }

  findAll() {
    return this.planModel.findAll();
  }

  async findOne(id: string) {
    const plan = await this.planModel.findOne({
      where: { id },
    });
    if (plan) {
      return plan;
    } else {
      throw new NotFoundException('Plan not found');
    }
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    console.log('Update plan dto', updatePlanDto);
    try {
      const plan = await this.findOne(id);

      await plan.update(updatePlanDto);
      await plan.save();

      return plan;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    const plan = await this.findOne(id);

    return await plan.destroy();
  }
}
