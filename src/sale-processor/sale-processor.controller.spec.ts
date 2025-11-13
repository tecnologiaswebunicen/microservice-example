import { Test, TestingModule } from '@nestjs/testing';
import { SaleProcessorController } from './sale-processor.controller';
import { SaleProcessorService } from './sale-processor.service';
import { CreateSaleProcessorDto } from './dto/create-sale-processor.dto';
import { UpdateSaleProcessorDto } from './dto/update-sale-processor.dto';

describe('SaleProcessorController', () => {
  let controller: SaleProcessorController;
  let service: SaleProcessorService;

  // Mock RabbitMQ context
  const mockRmqContext = {
    getChannelRef: jest.fn().mockReturnValue({
      ack: jest.fn(),
      nack: jest.fn(),
    }),
    getMessage: jest.fn().mockReturnValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleProcessorController],
      providers: [SaleProcessorService],
    }).compile();

    controller = module.get<SaleProcessorController>(SaleProcessorController);
    service = module.get<SaleProcessorService>(SaleProcessorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should process sale creation and acknowledge message', () => {
      const createDto: CreateSaleProcessorDto = {
        productId: 'PROD-001',
        productName: 'Laptop',
        quantity: 2,
        price: 999.99,
        customerId: 'CUST-123',
        customerName: 'John Doe',
      };

      const expectedResult = {
        success: true,
        message: 'Sale created and processed',
        data: createDto,
      };

      jest.spyOn(service, 'create').mockReturnValue(expectedResult);

      const result = controller.create(createDto, mockRmqContext as any);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
      expect(mockRmqContext.getChannelRef().ack).toHaveBeenCalled();
    });

    it('should nack message on error', () => {
      const createDto: CreateSaleProcessorDto = {
        productId: 'PROD-001',
        productName: 'Laptop',
        quantity: 2,
        price: 999.99,
        customerId: 'CUST-123',
        customerName: 'John Doe',
      };

      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new Error('Processing failed');
      });

      expect(() => {
        controller.create(createDto, mockRmqContext as any);
      }).toThrow('Processing failed');

      expect(mockRmqContext.getChannelRef().nack).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should process sale update and acknowledge message', () => {
      const updateDto: UpdateSaleProcessorDto = {
        id: 1,
        quantity: 3,
        price: 899.99,
      };

      const expectedResult = {
        success: true,
        message: 'Sale #1 updated and processed',
        data: updateDto,
      };

      jest.spyOn(service, 'update').mockReturnValue(expectedResult);

      const result = controller.update(updateDto, mockRmqContext as any);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(expectedResult);
      expect(mockRmqContext.getChannelRef().ack).toHaveBeenCalled();
    });

    it('should nack message on error', () => {
      const updateDto: UpdateSaleProcessorDto = {
        id: 1,
        quantity: 3,
      };

      jest.spyOn(service, 'update').mockImplementation(() => {
        throw new Error('Update failed');
      });

      expect(() => {
        controller.update(updateDto, mockRmqContext as any);
      }).toThrow('Update failed');

      expect(mockRmqContext.getChannelRef().nack).toHaveBeenCalled();
    });
  });
});
