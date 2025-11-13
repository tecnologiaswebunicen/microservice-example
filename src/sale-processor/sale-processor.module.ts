import { Module } from '@nestjs/common';
import { SaleProcessorService } from './sale-processor.service';
import { SaleProcessorController } from './sale-processor.controller';

@Module({
  controllers: [SaleProcessorController],
  providers: [SaleProcessorService],
})
export class SaleProcessorModule {}
