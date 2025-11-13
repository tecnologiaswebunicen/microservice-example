import { Test, TestingModule } from '@nestjs/testing';
import { SaleProcessorService } from './sale-processor.service';
import { CreateSaleProcessorDto } from './dto/create-sale-processor.dto';
import { UpdateSaleProcessorDto } from './dto/update-sale-processor.dto';

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

  describe('create', () => {
    it('should process and log a new sale creation', () => {
      const createDto: CreateSaleProcessorDto = {
        productId: 'PROD-001',
        productName: 'Laptop',
        quantity: 2,
        price: 999.99,
        customerId: 'CUST-123',
        customerName: 'John Doe',
        timestamp: new Date('2025-11-13T10:00:00Z'),
      };

      const logSpy = jest.spyOn(service['logger'], 'log');
      const result = service.create(createDto);

      expect(result).toEqual({
        success: true,
        message: 'Sale created and processed',
        data: createDto,
      });
      expect(logSpy).toHaveBeenCalledWith('=== Processing Sale Creation ===');
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Laptop'));
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('John Doe'));
      expect(logSpy).toHaveBeenCalledWith('✅ Sale created successfully');
    });

    it('should handle sale creation without timestamp', () => {
      const createDto: CreateSaleProcessorDto = {
        productId: 'PROD-002',
        productName: 'Mouse',
        quantity: 5,
        price: 29.99,
        customerId: 'CUST-456',
        customerName: 'Jane Smith',
      };

      const result = service.create(createDto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(createDto);
    });
  });

  describe('update', () => {
    it('should process and log a sale update', () => {
      const updateDto: UpdateSaleProcessorDto = {
        id: 1,
        quantity: 3,
        price: 899.99,
      };

      const logSpy = jest.spyOn(service['logger'], 'log');
      const result = service.update(1, updateDto);

      expect(result).toEqual({
        success: true,
        message: 'Sale #1 updated and processed',
        data: updateDto,
      });
      expect(logSpy).toHaveBeenCalledWith('=== Processing Sale Update ===');
      expect(logSpy).toHaveBeenCalledWith('Sale ID: 1');
      expect(logSpy).toHaveBeenCalledWith('Updated Quantity: 3');
      expect(logSpy).toHaveBeenCalledWith('Updated Price: $899.99');
      expect(logSpy).toHaveBeenCalledWith('✅ Sale updated successfully');
    });

    it('should handle partial updates', () => {
      const updateDto: UpdateSaleProcessorDto = {
        id: 2,
        productName: 'Updated Laptop Pro',
      };

      const logSpy = jest.spyOn(service['logger'], 'log');
      const result = service.update(2, updateDto);

      expect(result.success).toBe(true);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Updated Laptop Pro'));
    });
  });
});
