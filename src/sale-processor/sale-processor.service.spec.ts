import { Test, TestingModule } from '@nestjs/testing';
import { SaleProcessorService } from './sale-processor.service';

describe('SaleProcessorService', () => {
  let service: SaleProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaleProcessorService],
    }).compile();

    service = module.get<SaleProcessorService>(SaleProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
