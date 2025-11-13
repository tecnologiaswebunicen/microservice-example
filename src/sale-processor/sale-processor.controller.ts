import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { SaleProcessorService } from './sale-processor.service';
import { CreateSaleProcessorDto } from './dto/create-sale-processor.dto';
import { UpdateSaleProcessorDto } from './dto/update-sale-processor.dto';

@Controller()
export class SaleProcessorController {
  private readonly logger = new Logger(SaleProcessorController.name);

  constructor(private readonly saleProcessorService: SaleProcessorService) {}

  @MessagePattern('sale.create')
  create(@Payload() createSaleProcessorDto: CreateSaleProcessorDto, @Ctx() context: RmqContext) {
    this.logger.log(`📨 Received 'sale.create' message`);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    
    try {
      const result = this.saleProcessorService.create(createSaleProcessorDto);
      channel.ack(originalMsg);
      return result;
    } catch (error) {
      this.logger.error(`Error processing sale creation: ${error.message}`);
      // Reject and don't requeue on error
      channel.nack(originalMsg, false, false);
      throw error;
    }
  }

  @MessagePattern('sale.update')
  update(@Payload() updateSaleProcessorDto: UpdateSaleProcessorDto, @Ctx() context: RmqContext) {
    this.logger.log(`📨 Received 'sale.update' message`);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    
    try {
      const result = this.saleProcessorService.update(
        updateSaleProcessorDto.id,
        updateSaleProcessorDto,
      );
      channel.ack(originalMsg);
      return result;
    } catch (error) {
      this.logger.error(`Error processing sale update: ${error.message}`);
      // Reject and don't requeue on error
      channel.nack(originalMsg, false, false);
      throw error;
    }
  }
}
