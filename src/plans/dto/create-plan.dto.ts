import { IsNotEmpty } from 'class-validator';

export class CreatePlanDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  duration_in_days: number;
}
