import { IsNotEmpty } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  plan_id: string;
}
