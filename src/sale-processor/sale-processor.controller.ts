import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SaleProcessorService } from './sale-processor.service';
import { CreateSaleProcessorDto } from './dto/create-sale-processor.dto';
import { UpdateSaleProcessorDto } from './dto/update-sale-processor.dto';

@Controller()
export class SaleProcessorController {
  constructor(private readonly saleProcessorService: SaleProcessorService) {}

  @MessagePattern('createSaleProcessor')
  create(@Payload() createSaleProcessorDto: CreateSaleProcessorDto) {
    return this.saleProcessorService.create(createSaleProcessorDto);
  }

  @MessagePattern('updateSaleProcessor')
  update(@Payload() updateSaleProcessorDto: UpdateSaleProcessorDto) {
    return this.saleProcessorService.update(
      updateSaleProcessorDto.id,
      updateSaleProcessorDto,
    );
  }
}
