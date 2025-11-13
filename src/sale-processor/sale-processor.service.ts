import { Injectable, Logger } from '@nestjs/common';
import { CreateSaleProcessorDto } from './dto/create-sale-processor.dto';
import { UpdateSaleProcessorDto } from './dto/update-sale-processor.dto';

@Injectable()
export class SaleProcessorService {
  private readonly logger = new Logger(SaleProcessorService.name);

  create(createSaleProcessorDto: CreateSaleProcessorDto) {
    this.logger.log('=== Processing Sale Creation ===');
    this.logger.log(`Product: ${createSaleProcessorDto.productName} (ID: ${createSaleProcessorDto.productId})`);
    this.logger.log(`Quantity: ${createSaleProcessorDto.quantity}`);
    this.logger.log(`Price: $${createSaleProcessorDto.price}`);
    this.logger.log(`Total: $${createSaleProcessorDto.quantity * createSaleProcessorDto.price}`);
    this.logger.log(`Customer: ${createSaleProcessorDto.customerName} (ID: ${createSaleProcessorDto.customerId})`);
    this.logger.log(`Timestamp: ${createSaleProcessorDto.timestamp || new Date().toISOString()}`);
    this.logger.log('✅ Sale created successfully');
    
    return {
      success: true,
      message: 'Sale created and processed',
      data: createSaleProcessorDto,
    };
  }

  update(id: number, updateSaleProcessorDto: UpdateSaleProcessorDto) {
    this.logger.log('=== Processing Sale Update ===');
    this.logger.log(`Sale ID: ${id}`);
    
    if (updateSaleProcessorDto.productName) {
      this.logger.log(`Updated Product: ${updateSaleProcessorDto.productName}`);
    }
    if (updateSaleProcessorDto.quantity !== undefined) {
      this.logger.log(`Updated Quantity: ${updateSaleProcessorDto.quantity}`);
    }
    if (updateSaleProcessorDto.price !== undefined) {
      this.logger.log(`Updated Price: $${updateSaleProcessorDto.price}`);
    }
    if (updateSaleProcessorDto.customerName) {
      this.logger.log(`Updated Customer: ${updateSaleProcessorDto.customerName}`);
    }
    
    this.logger.log('✅ Sale updated successfully');
    
    return {
      success: true,
      message: `Sale #${id} updated and processed`,
      data: updateSaleProcessorDto,
    };
  }
}
