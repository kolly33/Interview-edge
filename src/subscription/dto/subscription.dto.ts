import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEnum(['starter', 'professional', 'power-user', 'enterprise', 'pay-as-you-go'])
  plan: string;

  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;
}

export class UpdateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  subscriptionId: string;

  @IsNotEmpty()
  @IsEnum(['starter', 'professional', 'power-user', 'enterprise', 'pay-as-you-go'])
  newPlan: string;
}

export class CancelSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  subscriptionId: string;

  @IsNotEmpty()
  @IsString()
  reason?: string;
}
