import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Logic to charge the customer
  @Post('charge')
  async chargeCustomer() {
    const user_id = '12345';
    return this.paymentService.initiatePayment(
      user_id,
      100,
      'olajosh94@gmail.com',
    );
  }

  // Logic to handle subscription payment
  // @Post('subscribe')
  // async subscribe() {
  //   return this.paymentService.subscribe();
  // }

  // Logic to handle payment intent
  // Crypto payment
  @Post('pay')
  async paymentIntent(@Body('paymentIntent') paymentIntent: string) {
    return this.paymentService.handlePayment(paymentIntent);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];

    const response = await this.paymentService.handleWebhook(req.body, sig);
    res.send({ received: response });
  }
}
