import { Injectable } from '@nestjs/common';
import { CreateSaleProcessorDto } from './dto/create-sale-processor.dto';
import { UpdateSaleProcessorDto } from './dto/update-sale-processor.dto';

@Injectable()
export class SaleProcessorService {
  create(createSaleProcessorDto: CreateSaleProcessorDto) {
    return 'This action adds a new saleProcessor';
  }

  findAll() {
    return `This action returns all saleProcessor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} saleProcessor`;
  }

  update(id: number, updateSaleProcessorDto: UpdateSaleProcessorDto) {
    return `This action updates a #${id} saleProcessor`;
  }

  remove(id: number) {
    return `This action removes a #${id} saleProcessor`;
  }
}
