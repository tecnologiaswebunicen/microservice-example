import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('SALES_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Sales Processor Microservice',
      rabbitmq: 'connected',
    };
  }

  @Get('test')
  async testSale() {
    const testSale = {
      productId: 'TEST-001',
      productName: 'Test Product',
      quantity: 1,
      price: 99.99,
      customerId: 'TEST-CUSTOMER',
      customerName: 'Test User',
      timestamp: new Date(),
    };

    try {
      const result = await lastValueFrom(
        this.client.send('sale.create', testSale),
      );
      return {
        success: true,
        message: 'Test sale processed successfully',
        sentData: testSale,
        response: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to process test sale',
        error: error.message,
      };
    }
  }
}
