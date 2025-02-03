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

  // Logic to confirm payment
  @Post('confirm')
  @HttpCode(200)
  async paymentIntent(@Body() paymentDto: PaymentIntentDto) {
    const paymentResponse = await this.paymentService.handlePayment(
      paymentDto.paymentIntent,
    );
    return {
      success: true,
      message: 'Payment confirmed successfully',
      data: paymentResponse,
    };
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];

    const response = await this.paymentService.handleWebhook(req.body, sig);
    res.send({ received: response });
  }

  // Endpoint to check all payments and subscription status
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
