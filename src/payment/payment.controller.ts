import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { PaymentIntentDto } from './dto/payment-intent.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Logic to charge the customer
  @Post('charge')
  @HttpCode(200)
  async chargeCustomer() {
    const user_id = '12345';
    const plan_id = 'f205fcde-9f03-4cae-aa66-76a81414ae64';
    return this.paymentService.initiatePayment(
      user_id,
      'olajosh94@gmail.com',
      plan_id,
    );
  }

  // Logic to handle subscription payment
  // @Post('subscribe')
  // async subscribe() {
  //   return this.paymentService.subscribe();
  // }

  // Logic to handle payment intent
  // Crypto payment
  @Post('crypto')
  @HttpCode(200)
  async paymentIntent(@Body() paymentDto: PaymentIntentDto) {
    return this.paymentService.handlePayment(paymentDto.paymentIntent);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];

    const response = await this.paymentService.handleWebhook(req.body, sig);
    res.send({ received: response });
  }

  // ENdpoint to check all payments and subscription status
  @Get('')
  async getPayments() {
    const payments = await this.paymentService.getPayments();
    return {
      status: 'success',
      message: 'Payments fetched successfully',
      data: payments,
    };
  }
}
