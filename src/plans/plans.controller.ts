import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  async create(@Body() createPlanDto: CreatePlanDto) {
    const plan = await this.plansService.create(createPlanDto);
    return {
      success: true,
      message: 'Plan created successfully',
      data: plan,
    };
  }

  @Get()
  async findAll() {
    const plans = await this.plansService.findAll();
    return {
      success: true,
      message: 'Plans fetched successfully',
      data: plans,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const plan = await this.plansService.findOne(id);
    return {
      success: true,
      message: 'Plan fetched successfully',
      data: plan,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    const plan = await this.plansService.update(id, updatePlanDto);
    return {
      success: true,
      message: 'Plan updated successfully',
      data: plan,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }
}
