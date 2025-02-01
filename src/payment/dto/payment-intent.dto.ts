import { IsNotEmpty } from 'class-validator';

export class PaymentIntentDto {
  @IsNotEmpty()
  paymentIntent: string;
}
