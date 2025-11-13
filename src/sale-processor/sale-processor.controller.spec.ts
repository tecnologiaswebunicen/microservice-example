import { Test, TestingModule } from '@nestjs/testing';
import { SaleProcessorController } from './sale-processor.controller';
import { SaleProcessorService } from './sale-processor.service';

describe('SaleProcessorController', () => {
  let controller: SaleProcessorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleProcessorController],
      providers: [SaleProcessorService],
    }).compile();

    controller = module.get<SaleProcessorController>(SaleProcessorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
