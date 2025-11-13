import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleProcessorDto } from './create-sale-processor.dto';

export class UpdateSaleProcessorDto extends PartialType(CreateSaleProcessorDto) {
  id: number;
}
